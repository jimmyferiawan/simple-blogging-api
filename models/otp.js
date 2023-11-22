const { DataTypes } = require("sequelize");
const sequelize = require("../configs/mysql.config");

const OtpModel = function (sequelizeConfig = sequelize) {
  return sequelizeConfig.define(
    "otp",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      otpCategory: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "otp_category",
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
        field: "created_date"
      },
      updatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "updated_date",
      },
      userEmail: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "user_email",
      },
      otpValue: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: "otp_value",
      }
    },
    {tableName: "otp", timestamps: false}
  );
}

module.exports = OtpModel