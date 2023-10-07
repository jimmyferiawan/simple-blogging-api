const { DataTypes } = require("sequelize");
const sequelize = require("../configs/mysql.config");
const Post = require("./post");
const Category = require("./category");

const PostCategory = sequelize.define(
  "PostCategory",
  {
    postId: {
      type: DataTypes.BIGINT,
      references: {
        key: "id",
        model: Post,
      },
    },
    categoryId: {
      type: DataTypes.BIGINT,
      references: {
        key: "id",
        model: Category,
      },
    },
  },
  {
    tableName: "post_category",
    timestamps: false,
  }
);

module.exports = PostCategory;
