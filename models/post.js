const { DataTypes } = require("sequelize");
const sequelize = require("../configs/mysql.config");
const User = require("./user");

const Post = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        key: "id",
        model: User,
      },
    },
    parentId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(75),
      allowNull: false,
      validate: {
        len: [1, 75],
      },
    },
    metaTitle: {
      type: DataTypes.STRING(75),
      validate: {
        len: [1, 75],
      },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      },
    },
    summary: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    published: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "post",
    timestamps: false,
  }
);

module.exports = Post;
