/* Импорты */
import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import express from "express";
import config from "config";
import logger from "./logger/logger.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import webApiConfig from "./config/web.api.json" assert { type: "json" };
import "./utils/array.js";
import { AuthRouteBase } from './constants/routes/auth.js';
import { BloggerRouteBase } from './constants/routes/blogger.js';
import BloggerRouter from './routers/blogger-routers.js';
import AuthRouter from './routers/auth-routers.js';
import UserRouter from './routers/user-routers.js';
import AdminRouter from './routers/admin-routers.js';
import errorMiddleware from './middlewares/error-middleware.js';
import db from "./db/index.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import ExpressSwaggerGenerator from 'express-swagger-generator';
import swiggerOptions from './config/swagger.options.js';
import { UserRouteBase } from './constants/routes/user.js';
import { AdminRouteBase } from './constants/routes/admin.js';
import { Server } from "socket.io";
import { v4 as uuid, v4 } from 'uuid';
import jwtService from './services/token/jwt-service.js';
import SendMessageDto from './dtos/messenger/send-message-dto.js';
import CreateRoomDto from './dtos/messenger/create-room-dto.js';
import ConnectRoomDto from './dtos/messenger/connect-room-dto.js';
import CreateChatDto from './dtos/messenger/create-chat-dto.js';
import ACTIONS from './constants/values/actions.js';
import { validate, version } from 'uuid';
import { QueryTypes } from 'sequelize';
import TransferTokenDto from './dtos/messenger/transfer-token-dto.js';
import { declOfNum } from './utils/value.js';
import bloggerService from './services/blogger/blogger-service.js';
import RequestServiceDto from './dtos/messenger/request-service-dto.js';

// Получение названия текущей директории
const __dirname = dirname(fileURLToPath(import.meta.url));
// Загрузка Swagger документации из каталога docs
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'docs.yaml'));

// Инициализация экземпляра express-приложения
const app = express();

// Если разрешена демонстрация устаревшей версии Swagger
if (config.get("doc.swagger2") === true) {
    // то демонстрируем документацию помимо OpenAPI 3 версию документации Open API 2
    const expressSwaggerGenerator = ExpressSwaggerGenerator(express());
    expressSwaggerGenerator(swiggerOptions(__dirname));
}

// Добавление в промежуточкое ПО раздачу статики из директории public
app.use('/public', express.static('public'));
// Добавление обработки запросов с JSON
app.use(express.json({ extended: true }));
// Добавление парсинка куки
app.use(cookieParser());
// Добавление вывода документации сервиса
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Настройка CORS-политик
app.use(cors({
    credentials: true,
    origin: webApiConfig['web_api'].map((value) => {
        return value;
    })
}));
// Связывание глобальных маршрутов с роутерами
app.use(AuthRouteBase, AuthRouter);
app.use(UserRouteBase, UserRouter);
app.use(AdminRouteBase, AdminRouter);
app.use(BloggerRouteBase, BloggerRouter);

// Добавление промежуточного ПО для обработки ошибок
app.use(errorMiddleware);

const PORT = config.get('port') || 5000;

/**
 * Запуск express-приложения (начало прослушивания по определённому порту)
 * @returns
 */
const start = () => {
    try {
        // Начало прослушивания конкретного порта
        const server = app.listen(PORT, () => console.log(`Сервер запущен с портом ${PORT}`));
        logger.info({
            port: PORT,
            message: "Запуск сервера"
        });

        // Возвращение экземпляра
        return server;
    } catch (e) {
        logger.error({
            message: e.message
        });

        process.exit(1);
    }
}

const server = start();

const SOCKET_LIST = {};
const io = new Server(server);

const getClientRooms = async () => {
    const { rooms } = io.sockets.adapter;
    //Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4);
    const conferences = await db.Conferences.findAll({
        attributes: ["link", "is_active"],
        where: {
            is_active: true
        },
        include: {
            attributes: ["id", "email"],
            model: db.Users,
            include: {
                attributes: ["nickname"],
                model: db.UsersData
            }
        }
    });

    // return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4);
    return conferences.map((item) => {
        return {
            link: item.link,
            is_active: item.is_active,
            email: item.user.email,
            nickname: item.user.users_data[0].nickname
        }
    });
}

const shareRoomsInfo = async () => {
    const rooms = await getClientRooms();
    io.emit(ACTIONS.SHARE_ROOMS, {
        rooms: rooms
    });
}

io.on("connection", (socket) => {
    // Обработка события установки авторизационных данных в системе (в глобальном объекте сокетов)
    socket.on("set_authorization_data", (data) => {
        if (!SOCKET_LIST[socket.id]) {
            const users_data = jwtService.validateAccessToken(data.access_token);
            if (!users_data) {
                socket.emit("error", { message: "Ошибка: невозможно авторизоваться" });
                return;
            }

            socket.users_data = users_data;
            SOCKET_LIST[socket.id] = socket;

            socket.emit("authorization_success", { message: "Успешная авторизация! " });
        } else {
            socket.emit("authorization_success");
        }
    });

    // Создание новой комнаты
    socket.on("create_room", async (data) => {
        if (!SOCKET_LIST[socket.id]) {
            socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
            return;
        }

        const createRoomDto = new CreateRoomDto(data);
        if (!createRoomDto.validate()) {
            socket.emit("error", { message: "Ошибка: некорректные данные" });
            return;
        }

        const t = await db.sequelize.transaction();

        const room = await db.Rooms.create({
            uuid: uuid(),
            is_private: createRoomDto.is_private,
            users_id: socket.users_data.users_id
        }, { transaction: t });

        if (!room) {
            socket.emit("error", { message: "Ошибка: невозможно создать новую комнату" });
            await t.rollback();
            return;
        }

        await db.RoomsUsers.create({
            users_id: socket.users_data.users_id,
            rooms_id: room.id
        }, { transaction: t });

        for (let i = 0; i < createRoomDto.users_list.length; i++) {
            const user = createRoomDto.users_list[i];

            console.log(user);
            await db.RoomsUsers.create({
                users_id: user,
                rooms_id: room.id
            }, { transaction: t });
        }

        await t.commit();
        socket.emit("room_created", { rooms_uuid: room.uuid });
    });

    // Создание нового чата
    socket.on("create_chat", async (data) => {
        if (!SOCKET_LIST[socket.id]) {
            socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
            return;
        }

        const createChatDto = new CreateChatDto(data);

        const otherUser = await db.UsersData.findOne({
            where: {
                nickname: createChatDto.nickname
            },
            include: {
                model: db.Users
            }
        });

        if (!otherUser) {
            socket.emit("error", { message: `Ошибка: пользователя с никнеймом ${createChatDto.nickname} не существует` });
            return;
        }

        if (otherUser.users_id === socket.users_data.users_id) {
            socket.emit("error", { message: "Ошибка: нельзя создать чат с самим собой" });
            return
        }

        // Проверка на существование чата между пользователями
        const query = `SELECT
                         rooms_id,
                        COUNT(rooms_id)
                        FROM
                            (
                                SELECT rooms_users.* FROM rooms_users
                                INNER JOIN rooms ON rooms.id = rooms_users.rooms_id
                                WHERE (rooms_users.users_id = ${socket.users_data.users_id} OR rooms_users.users_id = ${otherUser.users_id}) AND (rooms.is_private = true)
                            ) as res_table
                        GROUP BY
                            rooms_id
                        HAVING 
                            COUNT(rooms_id) > 1`;
        const duplicate = await db.sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        const t = await db.sequelize.transaction();
        if (duplicate.length > 0) {
            // Если чат с пользователем уже создан, то просто добавляем сообщение в уже существующий чат
            const duplicateLast = duplicate[duplicate.length - 1];
            const room = await db.Rooms.findOne({
                where: {
                    id: duplicateLast.rooms_id
                }
            });

            if (!room) {
                socket.emit("error", { message: "Ошибка: существующая комната не была обнаружена" });
                await t.rollback();
                return;
            }

            await db.Messages.create({
                users_id: socket.users_data.users_id,
                text: createChatDto.text,
                rooms_id: room.id
            }, { transaction: t });

            await t.commit();
            socket.emit("create_chat_result", { rooms_uuid: room.uuid });
            return;
        }

        const room = await db.Rooms.create({
            uuid: uuid(),
            is_private: true,
            users_id: socket.users_data.users_id
        }, { transaction: t });

        if (!room) {
            socket.emit("error", { message: "Ошибка: невозможно создать новую комнату" });
            await t.rollback();
            return;
        }

        // Подключение текущего пользователя к комнате
        await db.RoomsUsers.create({
            users_id: socket.users_data.users_id,
            rooms_id: room.id
        }, { transaction: t });

        // Подключение другого пользователя к комнате
        await db.RoomsUsers.create({
            users_id: otherUser.user.id,
            rooms_id: room.id
        }, { transaction: t });

        await db.Messages.create({
            users_id: socket.users_data.users_id,
            text: createChatDto.text,
            rooms_id: room.id
        }, { transaction: t });

        await t.commit();
        socket.emit("create_chat_result", { rooms_uuid: room.uuid });

        let findSocket = null;
        for (let key in SOCKET_LIST) {
            if (SOCKET_LIST[key].users_data.users_id === otherUser.user.id) {
                findSocket = SOCKET_LIST[key];
                break;
            }
        }

        if (findSocket) {
            // Отправка сообщения о том, что был создан новый чат и нужно обновить существующие данные
            findSocket.emit("new_chat");
        }
    });

    // Подключение к комнате
    socket.on("room_connection", async (data) => {
        if (!SOCKET_LIST[socket.id]) {
            socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
            return;
        }

        const room = new ConnectRoomDto(data);
        if (!room.uuid_validate()) {
            socket.emit("error", { message: "Ошибка: некорректный идентификатор комнаты" });
            return;
        }

        const roomDb = await db.Rooms.findOne({
            where: {
                uuid: room.rooms_uuid
            }
        });

        if (!roomDb) {
            socket.emit("error", ({ message: `Ошибка: комнаты с идентификатором ${room.rooms_uuid} не существует` }));
            return;
        }

        // Подключение к комнате
        socket.join(room.rooms_uuid);
        socket.emit("room_connection_success", { room_uuid: room.rooms_uuid });
    });

    // Создание нового сообщения
    socket.on("send_message", async (data) => {
        if (!SOCKET_LIST[socket.id]) {
            socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
            return;
        }

        const messageDto = new SendMessageDto(data);
        if (!messageDto.uuid_validate()) {
            socket.emit("error", { message: "Ошибка: некорректный идентификатор комнаты" });
            return;
        }

        const room = await db.Rooms.findOne({
            where: {
                uuid: messageDto.rooms_uuid
            }
        });

        if (!room) {
            socket.emit("error", ({ message: `Ошибка: комнаты с идентификатором ${messageDto.rooms_uuid} не существует` }));
            return;
        }

        if (!socket.rooms.has(messageDto.rooms_uuid)) {
            socket.emit("error", ({ message: `Ошибка: пользователь не присоединён к комнате с идентификатором ${messageDto.rooms_uuid}` }));
            return;
        }

        const message = await db.Messages.create({
            rooms_id: room.id,
            text: messageDto.text,
            users_id: socket.users_data.users_id,
        });

        const userMessage = await db.Users.findOne({
            attributes: ["email"],
            where: {
                id: socket.users_data.users_id
            },
            include: {
                model: db.UsersData
            }
        });

        // Отправка нового сообщения в комнату
        io.to(room.uuid).emit("new_message", {
            rooms_uuid: room.uuid,
            users_id: socket.users_data.users_id,
            text: messageDto.text,
            created_at: message.created_at,
            updated_at: message.updated_at,
            user: userMessage
        });
    });

    // Отправка токенов в определённую комнату
    socket.on("transfer_token", async (data) => {

        const t = await db.sequelize.transaction();
        try {
            if (!SOCKET_LIST[socket.id]) {
                socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
                return;
            }

            let input = new TransferTokenDto(data);
            if (!input.uuid_validate()) {
                socket.emit("error", { message: "Ошибка: некорректный идентификатор комнаты" });
                return;
            }

            if (input.tokens < 0) {
                input.tokens = -input.tokens;
            }

            const conference = await db.Conferences.findOne({
                where: {
                    link: input.rooms_uuid
                }
            });

            if (!conference) {
                socket.emit("error", { message: `Ошибка: комнаты с идентификатором ${input.rooms_uuid} не существует` });
                return;
            }

            const usersData = await db.UsersData.findOne({
                where: {
                    users_id: socket.users_data.users_id
                },
                transaction: t
            });

            if (!usersData) {
                socket.emit("error", { message: `Ошибка: пользователя с идентификатором ${socket.users_data.users_id} не найдено` });
                return;
            }

            if ((usersData.tokens - input.tokens) < 0) {
                socket.emit("error", { message: "Ошибка: недостаточно средств, пополните свой счёт через личный кабинет" });
                return;
            }

            usersData.tokens = usersData.tokens - input.tokens;
            await usersData.save();

            await db.TransferTokens.create({
                receiver_id: conference.users_id,
                sender_id: socket.users_data.users_id,
                tokens: input.tokens
            }, { transaction: t });

            const text = `Пользователь под ником ${usersData.nickname} отправил ${input.tokens} ${declOfNum(input.tokens, [
                "токен",
                "токена",
                "токенов",
            ])} `;

            const message = await db.Messages.create({
                rooms_id: conference.rooms_id,
                text: text,
                users_id: null
            });

            await t.commit();

            // Отправка уведомления в комнату
            io.to(input.rooms_uuid).emit("new_message", {
                rooms_uuid: input.rooms_uuid,
                users_id: null,
                text: text,
                created_at: message.created_at,
                updated_at: message.updated_at,
            });
        } catch (e) {
            await t.rollback();
            console.log(e);
        }
    });

    // Получение всех сообщений из комнаты
    socket.on("get_messages", async (data) => {
        if (!SOCKET_LIST[socket.id]) {
            socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
            return;
        }

        const room = new ConnectRoomDto(data);
        if (!room.uuid_validate()) {
            socket.emit("error", { message: "Ошибка: некорректный идентификатор комнаты" });
            return;
        }

        const roomDb = await db.Rooms.findOne({
            where: {
                uuid: room.rooms_uuid
            }
        });

        if (!roomDb) {
            socket.emit("error", { message: `Ошибка: комнаты с идентификатором ${room.rooms_uuid} не существует` });
            return;
        }

        if (!socket.rooms.has(room.rooms_uuid)) {
            socket.emit("error", { message: `Ошибка: текущий пользователь не подключён к комнате с идентификатором ${room.rooms_uuid}` });
            return;
        }

        const roomOthersUsers = await db.RoomsUsers.findOne({
            attributes: [],
            where: {
                users_id: {
                    [db.Sequelize.Op.ne]: socket.users_data.users_id
                },
                rooms_id: roomDb.id
            },
            include: {
                model: db.Users,
                attributes: ["id", "email"],
                where: {
                    id: {
                        [db.Sequelize.Op.eq]: db.Sequelize.col("rooms_users.users_id")
                    }
                },
                include: {
                    attributes: ["nickname", "tokens"],
                    model: db.UsersData
                }
            }
        });

        const messages = await db.Messages.findAll({
            where: {
                rooms_id: roomDb.id
            },
            order: [
                ["created_at", "ASC"]
            ]
        });

        socket.emit("get_messages_result", {
            user: roomOthersUsers.dataValues.user,
            messages: messages,
            rooms_uuid: room.rooms_uuid
        });
    });

    // Получение всех сообщений из групповой комнаты
    socket.on("get_messages_group", async (data) => {
        if (!SOCKET_LIST[socket.id]) {
            socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
            return;
        }

        const room = new ConnectRoomDto(data);
        if (!room.uuid_validate()) {
            socket.emit("error", { message: "Ошибка: некорректный идентификатор комнаты" });
            return;
        }

        const roomDb = await db.Rooms.findOne({
            where: {
                uuid: room.rooms_uuid
            }
        });

        if (!roomDb) {
            socket.emit("error", { message: `Ошибка: комнаты с идентификатором ${room.rooms_uuid} не существует` });
            return;
        }

        if (!socket.rooms.has(room.rooms_uuid)) {
            socket.emit("error", { message: `Ошибка: текущий пользователь не подключён к комнате с идентификатором ${room.rooms_uuid}` });
            return;
        }

        const roomUsers = await db.RoomsUsers.findAll({
            attributes: [],
            where: {
                users_id: {
                    [db.Sequelize.Op.ne]: socket.users_data.users_id
                },
                rooms_id: roomDb.id
            },
            include: {
                model: db.Users,
                attributes: ["id", "email"],
                where: {
                    id: {
                        [db.Sequelize.Op.eq]: db.Sequelize.col("rooms_users.users_id")
                    }
                },
                include: {
                    attributes: ["nickname", "tokens"],
                    model: db.UsersData
                }
            }
        });

        const messages = await db.Messages.findAll({
            where: {
                rooms_id: roomDb.id
            },
            include: {
                attributes: ["email"],
                model: db.Users,
                include: {
                    model: db.UsersData
                }
            },
            order: [
                ["created_at", "ASC"]
            ]
        });

        socket.emit("get_messages_group_result", {
            users: roomUsers,
            messages: messages,
            rooms_uuid: room.rooms_uuid
        });
    })

    // Получение списка всех чатов, в которых находится пользователь
    socket.on("get_chats", async () => {
        if (!SOCKET_LIST[socket.id]) {
            socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
            return;
        }

        const roomsUsers = await db.RoomsUsers.findAll({
            where: {
                users_id: socket.users_data.users_id,
            },
            include: {
                model: db.Rooms
            }
        });

        if (roomsUsers.length === 0) {
            return;
        }

        const roomOthersUsers = await db.RoomsUsers.findAll({
            attributes: [],
            where: {
                users_id: {
                    [db.Sequelize.Op.ne]: socket.users_data.users_id
                },
                rooms_id: {
                    [db.Sequelize.Op.in]: roomsUsers.map((item) => item.rooms_id)
                }
            },
            order: [
                [{ model: db.Rooms }, "created_at", "DESC"]
            ],
            include: [
                {
                    attributes: ["id", "uuid", "is_private"],
                    model: db.Rooms,
                    where: {
                        is_private: true
                    },
                    include: {
                        model: db.Messages,
                        order: [
                            ["created_at", "DESC"]
                        ],
                        limit: 1
                    }
                },
                {
                    model: db.Users,
                    attributes: ["id", "email"],
                    where: {
                        id: {
                            [db.Sequelize.Op.eq]: db.Sequelize.col("rooms_users.users_id")
                        }
                    },
                    include: {
                        attributes: ["nickname", "tokens"],
                        model: db.UsersData
                    }
                }
            ]
        });

        roomsUsers.forEach((item) => {
            if (!socket.rooms.has(item.dataValues.room.uuid)) {
                socket.join(item.dataValues.room.uuid);
            }
        });

        socket.emit("get_chats_result", { chats: roomOthersUsers });
    });

    // Отключение пользователя из комнаты
    socket.on("room_disconnection", async (data) => {
        if (!SOCKET_LIST[socket.id]) {
            socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
            return;
        }

        const room = new ConnectRoomDto(data);
        if (!room.uuid_validate()) {
            socket.emit("error", { message: "Ошибка: некорректный идентификатор комнаты" });
            return;
        }

        const roomDb = await db.Rooms.findOne({
            where: {
                uuid: room.rooms_uuid
            }
        });

        if (!roomDb) {
            socket.emit("error", ({ message: `Ошибка: комнаты с идентификатором ${room.rooms_uuid} не существует` }));
            return;
        }

        // Выход из комнаты
        socket.leave(room.rooms_uuid);
    });

    // Отключение пользователя из всех комнат
    socket.on("room_disconnection_all", () => {
        const { rooms } = socket;

        Array.from(rooms)
            .forEach(room_uuid => {
                socket.leave(room_uuid);
            });

        socket.emit("room_disconnection_all_success");
    });

    // Отключение пользователя из системы
    socket.on("disconnection", async () => {
        const { rooms } = socket;
        Array.from(rooms)
            .forEach(room_uuid => {
                const clients = Array.from(io.sockets.adapter.rooms.get(room_uuid) || []);

                /*clients.forEach(clientID => {
                    // Отправляем всем клиентам в комнате сообщение о выходе из комнаты с идентификатором peer
                    io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                        peerID: socket.id
                    });

                    // Самому себе отправляем ID клиентов, комнаты которых покидаем
                    socket.emit(ACTIONS.REMOVE_PEER, {
                        peerID: clientID
                    });
                });*/

                // Выходим из комнаты
                socket.leave(room_uuid);
            });
    });

    // Отправка заявки пользователя для предоставления услуги блогером
    socket.on("request_service", async (data) => {
        if (!SOCKET_LIST[socket.id]) {
            socket.emit("error", ({ message: "Ошибка: пользователь не авторизован" }));
            return;
        }

        const req = new RequestServiceDto(data);
        if (!req.uuid_validate()) {
            socket.emit("error", { message: "Ошибка: некорректный идентификатор комнаты" });
            return;
        }

        const user = await db.UsersData.findOne({
            where: {
                users_id: socket.users_data.users_id
            }
        });

        if(!user) {
            socket.emit("error", { message: `Ошибка: пользователя с идентификатором ${socket.users_data.users_id} не найдено` });
            return;
        }

        const conference = await db.Conferences.findOne({
            where: {
                link: req.rooms_uuid
            }
        });

        if(!conference) {
            socket.emit("error", { message: `Ошибка: видеоконференция в комнате с идентификатором ${req.rooms_uuid} не запущена!` });
            return;
        }

        let findSocket = null;
        for (let key in SOCKET_LIST) {
            if (SOCKET_LIST[key].users_data.users_id === conference.users_id) {
                findSocket = SOCKET_LIST[key];
                break;
            }
        }

        if (findSocket) {
            // Отправка заявки на предоставление определённой услуги пользователем
            findSocket.emit("new_request_service", {
                services_id: req.services_id,
                nickname: user.nickname,
                users_id: user.users_id
            });
        }
    });


    /* Работа с WebRTC */
    shareRoomsInfo();
    socket.on(ACTIONS.CREATE, async () => {
        const t = await db.sequelize.transaction();

        try {
            // Проверка текущего пользователя на принадлежность к блоггерам
            const blogger = await db.Roles.findOne({
                where: {
                    title: 'blogger'
                }
            });

            const usersRoles = await db.UsersRoles.findOne({
                where: {
                    users_id: socket.users_data.users_id,
                    roles_id: blogger.id
                }
            });

            if (!usersRoles) {
                socket.emit("error", { message: "Ошибка: пользователь не имеет прав доступа для создания видеотрансляций" });
                return;
            }

            // Проверка, есть ли у пользователя уже открытые конференции
            let conference = await db.Conferences.findOne({
                where: {
                    users_id: socket.users_data.users_id
                },
                include: {
                    model: db.Rooms
                }
            });

            const usersData = await db.UsersData.findOne({
                where: {
                    users_id: socket.users_data.users_id
                }
            });

            if (conference) {
                // Конференция есть, подключаем к текущей конференции если он ещё к ней не подключён
                const { rooms: joinedRooms } = socket;

                if (Array.from(joinedRooms).includes(conference.room.uuid)) {
                    conference.is_active = true;
                    await conference.save();

                    console.warn(`Ошибка: пользователь уже подключён к комнате с идентификатором ${conference.room.uuid}`);
                    socket.emit("error", { message: `Ошибка: пользователь уже подключён к комнате с идентификатором ${conference.room.uuid}` });
                    return;
                }

                socket.join(conference.room.uuid);
                socket.emit(ACTIONS.CREATE_SUCCESS, {
                    room: {
                        link: conference.room.uuid,
                        nickname: usersData.nickname
                    }
                });
                return;
            }

            const roomID = v4();
            const room = await db.Rooms.create({
                users_id: socket.users_data.users_id,
                is_private: false,
                uuid: roomID
            }, { transaction: t });

            conference = await db.Conferences.create({
                rooms_id: room.id,
                users_id: socket.users_data.users_id,
                link: roomID,
                is_active: true
            }, { transaction: t });

            socket.join(roomID);
            socket.emit(ACTIONS.CREATE_SUCCESS, {
                room: {
                    link: roomID,
                    nickname: usersData.nickname
                }
            });
            await shareRoomsInfo();

            t.commit();
        } catch (e) {
            console.log(e);
            t.rollback();
            socket.emit("error", { message: e.message });
        }
    });

    // Начало новой записи
    socket.on("restart_capture", async (config) => {
        const { rooms_uuid } = config;
        const clients = Array.from(io.sockets.adapter.rooms.get(rooms_uuid) || []);

        // Поиск блоггера текущей комнаты
        const blogger = await db.Conferences.findOne({
            where: {
                link: rooms_uuid
            }
        });

        const bloggerArr = clients.map((item) => {
            return SOCKET_LIST[item];
        }).filter((item) => {
            return item.users_data.users_id === blogger.users_id
        });

        if (bloggerArr.length === 0) {
            return;
        }

        bloggerArr[0].emit("restart_capture_success");
    });

    // Подключение пользователя к комнате
    socket.on(ACTIONS.JOIN, async (config) => {
        const { room: roomID } = config;
        const room = await db.Rooms.findOne({
            where: {
                uuid: roomID
            },
            include: {
                model: db.Conferences
            }
        });

        if (!room) {
            socket.emit("error", { message: `Ошибка: комнаты с идентификатором ${roomID} не обнаружено!` });
            return;
        }

        /*if (!room.conferences[0].is_active) {
            socket.emit("error", { message: `Ошибка: комната в настоящее время не активна` });
            return;
        }*/

        const { rooms: joinedRooms } = socket;
        if (Array.from(joinedRooms).includes(roomID)) {
            return console.warn(`Ошибка: пользователь уже подключён к комнате с идентификатором ${roomID}`);
        }

        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
        clients.forEach(clientID => {
            io.to(clientID).emit(ACTIONS.ADD_PEER, {
                peerID: socket.id,
                createOffer: true
            });

            socket.emit(ACTIONS.ADD_PEER, {
                peerID: clientID,
                createOffer: false,
            });
        });

        socket.join(roomID);
        socket.emit("room_connection_success");
        await shareRoomsInfo();
    });

    // Получение информации о комнате
    socket.on("get_conference_info", async ({ rooms_uuid }) => {
        const conference = await db.Conferences.findOne({
            where: {
                link: rooms_uuid
            }
        });

        const conferenceAsBlogger = await db.Conferences.findOne({
            where: {
                link: rooms_uuid,
                users_id: socket.users_data.users_id
            }
        });

        const userRole = await db.UsersRoles.findOne({
            where: {
                users_id: socket.users_data.users_id
            },
            include: {
                model: db.Roles,
                where: {
                    title: 'blogger'
                }
            }
        });

        const usersData = await db.UsersData.findOne({
            where: {
                users_id: conference.users_id
            }
        });

        const services = await bloggerService.getCurrentServices({ blogger_id: conference.users_id });

        socket.emit("get_conference_info_success", {
            room: {
                nickname: usersData.nickname,
                link: conference.link,
                is_blogger: Boolean(conferenceAsBlogger && userRole),
                services: services
            }
        });
    });

    const leaveRoom = async () => {
        console.log("ВЫШЕЛ ИЗ КОМНАТЫ");
        const { rooms } = socket;
        const validRooms = Array.from(rooms)
            .filter(roomID => validate(roomID) && version(roomID) === 4);

        for (let i = 0; i < validRooms.length; i++) {
            const room = validRooms[i];
            const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);

            clients
                .forEach(clientID => {
                    io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                        peerID: socket.id,
                    });

                    socket.emit(ACTIONS.REMOVE_PEER, {
                        peerID: clientID,
                    });
                });

            const creatorConference = await db.Conferences.findOne({
                where: {
                    link: room,
                    users_id: socket.users_data.users_id
                }
            });

            // Если мы выходим из конференции и мы при этом создатель конференции
            /*if (creatorConference) {
                creatorConference.is_active = false;
                await creatorConference.save();
            }*/

            socket.leave(room);
        }

        await shareRoomsInfo();
    };

    socket.on(ACTIONS.LEAVE, async () => {
        console.log("leave")
        await leaveRoom();
    });

    socket.on(ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
        io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerID: socket.id,
            sessionDescription,
        });
    });

    socket.on(ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
        io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
            peerID: socket.id,
            iceCandidate,
        });
    });
});

