import Sequelize from "sequelize";
import dotenv from 'dotenv';

const { DataTypes } = Sequelize;
let DATABASE_URL;
dotenv.config();

if(process.env.NODE_ENV === `develop`)
  DATABASE_URL = process.env.CONNECT_DB_LOCAL;
else
  DATABASE_URL = process.env.CONNECT_DB_PRODUCT;

export const sequelize = new Sequelize(
  DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false // ★このように書いてこのプロパティを追加
      }
    },
  }
);

export const Players = sequelize.define(
  "players", 
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blockchainaddr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { underscored: true },
);

export const tempUser = sequelize.define(
  "tempuser", 
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true },
);

export const Items = sequelize.define(
  "items",
  {
    itemid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    open: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  { underscored: true },
)

export const TokenIdx = sequelize.define(
  "toknidx",
  {
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toknid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    open: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  { underscored: true },
)
