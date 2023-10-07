const { DataTypes } = require("sequelize");
const sequelize = require("../configs/mysql.config");
const Post = require("./post");
const Tag = require("./tag");

const PostTag = sequelize.define(
  "PostTag",
  {
    postId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        key: "id",
        model: Post,
      },
    },
    tagId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        key: "id",
        model: Tag,
      },
    },
  },
  {
    tableName: "post_tag",
    timestamps: false,
  }
);

module.exports = PostTag;
