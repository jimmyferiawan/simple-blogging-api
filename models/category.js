const { DataTypes } = require("sequelize");
const sequelize = require("../configs/mysql.config");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    parentId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        key: "id",
        model: this,
      },
    },
    title: {
      type: DataTypes.STRING(75),
      allowNull: false,
    },
    metaTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "category",
    timestamps: false,
  }
);

module.exports = Category;
