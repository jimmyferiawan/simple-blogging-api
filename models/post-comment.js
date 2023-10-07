const { DataTypes } = require("sequelize");
const sequelize = require("../configs/mysql.config");
const Post = require("./post");

const PostComment = sequelize.define(
  "PostComment",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    postId: {
      type: DataTypes.BIGINT,
      references: {
        key: "id",
        model: Post,
      },
    },
    parentId: {
      type: DataTypes.BIGINT,
      references: {
        key: "id",
        model: this,
      },
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    published: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "post_comment",
    timestamps: false,
  }
);

module.exports = PostComment;
