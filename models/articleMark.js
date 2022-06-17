const {Schema, Types, model} = require("mongoose");
const { account, article, articleMark } = require("./index");

const ArticleMarksSchema = new Schema (
    {
        articleId: {
            type: Types.ObjectId,
            ref: article.name,
            required: true
        },

        isLike: {
            type: Boolean,
            default: true
        },

        isDislike: {
            type: Boolean,
            default: false
        },

        authorAccountId: {
            type: Types.ObjectId,
            ref: account.name,
            required: true
        }
    }
);

module.exports = model(articleMark.name, ArticleMarksSchema);