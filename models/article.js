const {Schema, Types, model} = require("mongoose");
const { account, article } = require("./index");

const ArticleSchema = new Schema (
    {
        title: {
            type: String,
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

module.exports = model(article.name, ArticleSchema);