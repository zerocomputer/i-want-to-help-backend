const {Schema, Types, model} = require("mongoose");
const { account, article, articleComment } = require("./index");

const ArticleCommentsSchema = new Schema (
    {
        articleId: {
            type: Types.ObjectId,
            ref: article.name,
            required: true
        },

        text: {
            type: String,
            required: true
        },

        authorAccountId: {
            type: Types.ObjectId,
            ref: account.name,
            required: true
        }
    }
);

module.exports = model(articleComment.name, ArticleCommentsSchema);