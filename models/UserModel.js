const { DataTypes } = require("sequelize");
const sequelize = require("../configs/mysql.config");

const User = function (sequelizeConfig = sequelize) {
  return sequelizeConfig.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          is: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim,
        },
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      // middleName: {
      //   type: DataTypes.STRING(20),
      //   allowNull: true,
      // },
      // lastName: {
      //   type: DataTypes.STRING(20),
      //   allowNull: true,
      // },
      mobile: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      registeredAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      lastLogin: {
        type: DataTypes.DATE,
      },
      intro: {
        type: DataTypes.STRING,
      },
      profile: {
        type: DataTypes.TEXT,
      },
      emailConfirmed: {
        type: DataTypes.STRING(1),
        defaultValue: "N",
      },
      birthdate: {
        type: DataTypes.STRING,
        validate: {
          is: /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
        }
      }
    },
    { tableName: "user", timestamps: false }
  );
};

module.exports = User;
