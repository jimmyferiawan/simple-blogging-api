const { DataTypes } = require("sequelize");
const sequelize = require("../configs/mysql.config");

const Tag = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: "tag",
    timestamps: false,
  }
);

module.exports = Tag;
