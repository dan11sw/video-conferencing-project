import React, { FC, useEffect, useCallback, useState } from "react";
import styles from "./MessengerPage.module.css";
import socket, { SocketConnection } from "src/socket";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import base1 from "src/resources/images/base1.jpg";
import { IChatModel, IChats } from "src/models/messenger/IChatModel";
import ChatList from "src/components/MessengerPage/ChatList";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import SearchUser from "src/components/MessengerPage/SearchUser";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import Chat from "src/components/MessengerPage/Chat";
import {
  ICurrentChatModel,
  IMessage,
} from "src/models/messenger/ICurrentChatModel";
import useBeforeUnload from "src/hooks/useBeforeUnload";

const MessengerPage: FC<any> = () => {
  const authSelector = useAppSelector((selector) => selector.authReducer);
  const dispatch = useAppDispatch();
  const [chats, setChats] = useState<IChats>({
    chats: [],
  });

  const [chat, setChat] = useState<ICurrentChatModel | null>(null);

  // Проверка подключения сокета и его переподключение в случае, если сокет не был подключён к серверу
  useEffect(() => {
    if (socket.disconnected) {
      SocketConnection();
    }
  }, [socket, socket.connected]);

  useEffect(() => {
    // Обработка события получения всех чатов, в которых участвует пользователь
    socket.on("get_chats_result", (data: IChats) => {
      setChats(data);
    });

    // Отправка сообщения об авторизационных данных пользователя
    socket.emit("set_authorization_data", {
      access_token: authSelector.access_token,
    });

    // Обработка события "успешная авторизация пользователя"
    socket.on("authorization_success", () => {
      socket.emit("get_chats");
    });

    // Обработка события "получение сообщений"
    socket.on("get_messages_result", (data) => {
      setChat(data);
    });

    // Обработка события "создание нового чата"
    socket.on("new_chat", () => {
      socket.emit("get_chats");
    });
  }, []);

  useEffect(() => {
    socket.removeListener("new_message");
    socket.on("new_message", (data) => {
      if (chat && chat.rooms_uuid === data.rooms_uuid) {
        const message = {
          ...data,
          updated_at: data.created_at,
          rooms_id: 0,
        } as IMessage;

        setChat({
          ...chat,
          messages: chat.messages.concat(message),
        } as ICurrentChatModel);
      }

      if (chats.chats.length > 0) {
        const cloneChats: IChats = JSON.parse(JSON.stringify(chats));
        const index = cloneChats.chats.findIndex((item: any) => {
          return item.room.uuid == data.rooms_uuid;
        });

        if (index >= 0) {
          cloneChats.chats[index].room.messages[0] = data;
          setChats(cloneChats);
        }
      }
    });
  }, [chats, chat]);

  const onRoomConnection = (rooms_uuid: string) => {
    socket.emit("get_messages", { rooms_uuid });
  };

  const onCreateChat = () => {
    socket.on("create_chat_result", () => {
      socket.emit("get_chats");
    });
  };

  const [view, setView] = React.useState<boolean>(false);

  useBeforeUnload(() => {
    socket.emit("room_disconnection_all");
    socket.removeAllListeners();
    socket.disconnect();
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.explore}>
          <ChatList
            chats={chats.chats.map((item) => {
              return {
                room_uuid: item.room.uuid,
                image: base1,
                nickname: item.user.users_data[0].nickname,
                last_message: (item.room?.messages.length > 0)? item.room?.messages[0].text : "",
                updated_at: (item.room?.messages.length > 0)? item.room.messages[0].updated_at : new Date(),
              } as unknown as IChatModel;
            })}
            onRoomConnection={onRoomConnection}
          />
          <div className={styles.search}>
            <Button
              onClick={() => {
                setView(true);
              }}
            >
              Отправить сообщение
            </Button>
          </div>
        </div>
        <div className={styles.chat}>
          <Chat chat={chat} />
        </div>
      </div>
      {view && <SearchUser setView={setView} onCreateChat={onCreateChat} />}
    </>
  );
};

export default React.memo(MessengerPage);
