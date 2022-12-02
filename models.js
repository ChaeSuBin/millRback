import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

// export const sequelize = new Sequelize(
//     process.env.DATABASE_URL || 'postgres://bablkjkqvudvvl:52649b965a8c41931012628c37622060220dcee81b2544195bf5f461df173cd0@ec2-34-230-153-41.compute-1.amazonaws.com:5432/d8h9jh5bvb9scm', 
//     {
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false // ★このように書いてこのプロパティを追加
//       }
//     },}
//   );

export const sequelize = new Sequelize(
    "tempdb",      //DB名
    "postgres",      //ユーザー名
    "password",     //パスワード
    {
      dialect: "postgres"   //DBの製品名
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
