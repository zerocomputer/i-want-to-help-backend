const {Schema, Types, model} = require("mongoose");
const { article, articleAttachment } = require("./index");

const ArticleAttachmentSchema = new Schema (
    {
        articleId: {
            type: Types.ObjectId,
            ref: article.name,
            required: true
        },

        path: {
            type: String,
            required: true
        }
    }
);

module.exports = model(articleAttachment.name, ArticleAttachmentSchema);