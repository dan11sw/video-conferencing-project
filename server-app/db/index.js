/*--------------------------------------------------------
  Подключение к базе данных PostgreSQL.
  Общая точка входа всех моделей.
  -------------------------------------------------------- */

/* Конфигурация */
import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

/* Библиотеки */
import { Sequelize } from 'sequelize';
import config from 'config';

/* Модели Sequelize */
import Users from './models/Users.js';
import UsersRoles from './models/UsersRoles.js';
import UsersData from './models/UsersData.js';
import TransferTokens from './models/TransferTokens.js';
import Tokens from './models/Tokens.js';
import Roles from './models/Roles.js';
import PurchasedContent from './models/PurchasedContent.js';
import ContentSales from './models/ContentSales.js';
import ContentObjects from './models/ContentObjects.js';
import Rooms from './models/Rooms.js';
import RoomsUsers from './models/RoomsUsers.js';
import Messages from './models/Messages.js';
import Conferences from './models/Conferences.js';
import Services from './models/Services.js';
import UsersServices from './models/UsersServices.js';
import initRoles from './mock/roles/init-roles.js';

// Глобальный объект для работы с Sequelize ORM
const db = {};

// Подключение к базе данных PostgreSQL
const sequelize = new Sequelize(
  config.get("database").database,
  config.get("database").user,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: config.get("database").host,
    port: config.get("database").port,
    define: {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    logging: false,
    pool: {
      max: 1000,
      min: 0,
      idle: 20000,
      acquire: 20000
    }
  },
);

// Добавление глобальному объекту всех моделей
db.Users = Users(sequelize, Sequelize.DataTypes);
db.UsersData = UsersData(sequelize, Sequelize.DataTypes);
db.UsersRoles = UsersRoles(sequelize, Sequelize.DataTypes);
db.TransferTokens = TransferTokens(sequelize, Sequelize.DataTypes);
db.Tokens = Tokens(sequelize, Sequelize.DataTypes);
db.Roles = Roles(sequelize, Sequelize.DataTypes);
db.PurchasedContent = PurchasedContent(sequelize, Sequelize.DataTypes);
db.ContentSales = ContentSales(sequelize, Sequelize.DataTypes);
db.ContentObjects = ContentObjects(sequelize, Sequelize.DataTypes);
db.Rooms = Rooms(sequelize, Sequelize.DataTypes);
db.RoomsUsers = RoomsUsers(sequelize, Sequelize.DataTypes);
db.Messages = Messages(sequelize, Sequelize.DataTypes);
db.Conferences = Conferences(sequelize, Sequelize.DataTypes);
db.Services = Services(sequelize, Sequelize.DataTypes);
db.UsersServices = UsersServices(sequelize, Sequelize.DataTypes);

// Установка взаимосвязей между моделями (таблицами базы данных)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Синхронизация моделей с базой данных
sequelize.sync().then(result => {
  if (config.get('log.sequelize')) {
    console.log(result);
  }
  console.log("Синхронизация с базой данных: успешно");
}).catch(err => console.log(err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* Инициализация тестовыми данными */
if(config.get("test.init_db")){
  initRoles(db);
}

export default db;
