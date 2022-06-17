const { Types } = require("mongoose");

const References = require("../models");
const AccountModel = require("../models/account");
const ArticleModel = require("../models/article");
const ArticleMarkModel = require("../models/articleMark");
const ArticleCommentModel = require("../models/articleComment");
const ArticleAttachmentModel = require("../models/articleAttachment");

/**
 * Пак методов статьи
 * @author Nikita Sarychev
 */
module.exports = {
    /**
     * Создание поста
     * 
     * @param {object} req 
     * @param {object} res
     * @returns 
     */
    create: async function (req, res) {
        const {
            title,
            text
        } = req.body;

        let createdArticle;
        if (!(createdArticle = await ArticleModel.create(
            {
                title,
                text,
                authorAccountId: req.account._id
            }
        ))) {
            return res.status(500).json({message: "Ошибка записи статьи в БД"}).end();
        }

        return res.status(200).json(
            {
                article: {
                    _id: createdArticle._id,
                    title: createdArticle.title,
                    text: createdArticle.text
                }
            }
        ).end();
    },

    /**
     * Получение списка статей
     * (одного пользователя)
     * 
     * @param {object} req 
     * @param {object} res
     * @returns 
     */
    getList: async function (req, res) {
        const {
            accountId
        } = req.query;

        let foundAccount;
        if (!(foundAccount = await AccountModel.findById(new Types.ObjectId(accountId)))) {
            return res.status(404).json({message: "Указанный аккаунт отсутствует или был удалён"}).end();
        }

        let foundArticles;
        if ((foundArticles = await ArticleModel.aggregate(
            [
                {
                    $match: {
                        authorAccountId: foundAccount._id
                    }
                },
                {
                    $lookup: {
                        from: References.account.name,
                        localField: "authorAccountId",
                        foreignField: "_id",
                        as: "authorAccount",
                        pipeline: [
                            {$limit: 1},
                            {$project: {passwordHash: 0, __v: 0}}
                        ]
                    }
                },
                {
                    $unwind: "$authorAccount"
                },
                {
                    $project: {
                        authorAccountId: 0,
                        __v: 0
                    }
                }
            ]
        )).length === 0) {
            return res.status(404).json({message: "Не найдено ни одного поста"}).end();
        }

        return res.status(200).json(
            {
                articles: foundArticles
            }
        ).end();
    },

    /**
     * Получение подробной информации о статье
     * 
     * @param {object} req 
     * @param {object} res
     * @returns 
     */
    getInfo: async function (req, res) {
        const {
            articleId
        } = req.query;

        let foundArticle;
        if ((foundArticle = await ArticleModel.aggregate(
            [
                {
                    $match: {
                        _id: new Types.ObjectId(articleId)
                    }
                },
                {
                    $lookup: {
                        from: References.account.name,
                        localField: "authorAccountId",
                        foreignField: "_id",
                        as: "authorAccount",
                        pipeline: [
                            {$limit: 1},
                            {$project: {passwordHash: 0, __v: 0}}
                        ]
                    }
                },
                {
                    $unwind: "$authorAccount"
                },
                {
                    $lookup: {
                        from: References.articleComment.name,
                        localField: "_id",
                        foreignField: "articleId",
                        as: "comments",
                        pipeline: [
                            {
                                $lookup: {
                                    from: References.account.name,
                                    localField: "authorAccountId",
                                    foreignField: "_id",
                                    as: "authorAccount",
                                    pipeline: [
                                        {$limit: 1},
                                        {$project: {passwordHash: 0, __v: 0}}
                                    ]
                                }
                            },
                            {
                                $unwind: "$authorAccount"
                            },
                            {
                                $project: {__v: 0, authorAccountId: 0}
                            },
                        ]
                    }
                },
                {
                    $lookup: {
                        from: References.articleAttachment.name,
                        localField: "_id",
                        foreignField: "articleId",
                        as: "attachments",
                        pipeline: [
                            {$project: {__v: 0}}
                        ]
                    }
                },
                {
                    $project: {
                        authorAccountId: 0,
                        __v: 0
                    }
                }
            ]
        )).length === 0) {
            return res.status(404).json({message: "Статьи с указанным ID не найдено"}).end();
        }

        return res.status(200).json({article: foundArticle[0]}).end();
    },

    /**
     * Редактирование статьи
     * 
     * @param {object} req 
     * @param {object} res
     * @returns 
     */
    edit: async function (req, res) {
        const {
            articleId,
            title,
            text
        } = req.body;

        let foundArticle;
        if (!(foundArticle = await ArticleModel.findById(new Types.ObjectId(articleId)))) {
            return res.status(404).json({message: "Статьи с указанным ID не найдено"}).end();
        }

        if (foundArticle.authorAccountId.toString() !== req.account._id.toString()) {
            return res.status(403).json({message: "Вы не являетесь владельецм статьи"}).end();
        }

        if (!(await foundArticle.update({title, text}))) {
            return res.status(500).json({message: "Ошибка записи статьи в БД"}).end();
        }

        return res.status(200).end();
    },

    /**
     * Отправка комментариев
     * 
     * @param {object} req 
     * @param {object} res 
     * @returns
     */
    sendComment: async function (req, res) {
        const {
            articleId,
            text
        } = req.body;

        let foundArticle;
        if (!(foundArticle = await ArticleModel.findById(new Types.ObjectId(articleId)))) {
            return res.status(404).json({message: "Статьи с указанным ID не найдено"}).end();
        }

        let createdComment;
        if (!(createdComment = await ArticleCommentModel.create(
            {
                articleId: foundArticle._id,
                authorAccountId: req.account._id,
                text
            }
        ))) {
            return res.status(500).json({message: "Ошибка записи комментария в БД"}).end();
        }

        return res.status(200).json(
            {
                comment: {
                    _id: createdComment._id,
                    text: createdComment.text
                }
            }
        ).end();
    },

    /**
     * Редактирование комментариев статьи
     * 
     * @param {object} req 
     * @param {object} res
     * @returns 
     */
    editComment: async function (req, res) {
        const {
            commentId,
            text
        } = req.body;

        let foundComment;
        if (!(foundComment = await ArticleCommentModel.findById(new Types.ObjectId(commentId)))) {
            return res.status(404).json({message: "Комментария с указанным ID не существует или удалён"}).end();
        }

        if (foundComment.authorAccountId.toString() !== req.account._id.toString()) {
            return res.status(403).json({message: "Вы не являетесь владельцем комментария"}).end();
        }

        if (!(await foundComment.update({text}))) {
            return res.status(500).json({message: "Ошибка применения изменений в БД"}).end();
        }

        return res.status(200).end();
    },

    /**
     * Удаление комментария
     * 
     * @param {object} req 
     * @param {object} res
     * @returns 
     */
    removeComment: async function (req, res) {
        const {
            commentId
        } = req.query;

        let foundComment;
        if (!(foundComment = await ArticleCommentModel.findById(new Types.ObjectId(commentId)))) {
            return res.status(404).json({message: "Комментария с указанным ID не существует или удалён"}).end();
        }

        if (!(await foundComment.delete())) {
            return res.status(500).json({message: "Ошибка удаление комментарий из БД"}).end();
        }

        return res.status(200).end();
    },

    /**
     * Оценивание статей
     * 
     * @param {object} req 
     * @param {object} res
     * @returns 
     */
    mark: async function (req, res) {
        let {
            isLike,
            isDislike,
            articleId
        } = req.body;

        if (isLike && !isDislike) {
            isDislike = false;
        }

        if (!isLike && isDislike) {
            isLike = false;
        }

        let foundArticle;
        if (!(foundArticle = await ArticleModel.findById(new Types.ObjectId(articleId)))) {
            return res.status(404).json({message: "Статьи с указанным ID не найдено"}).end();
        }

        let foundMark;
        if (!(foundMark = await ArticleMarkModel.findOne({articleId: foundArticle._id, authorAccountId: req.account._id}))) {
            if (!(foundMark = await ArticleMarkModel.create(
                {
                    articleId: foundArticle._id, 
                    authorAccountId: req.account._id,
                    isDislike,
                    isLike, 
                }
            ))) {
                return res.status(500).json({message: "Ошибка записи оценки в БД"}).end();
            }
        } else {
            if (!(await foundMark.update({isLike, isDislike}))) {
                return res.status(500).json({message: "Ошибка применения изменений в БД"}).end();
            }
        }

        return res.status(200).json({isLike: isLike ?? foundMark.isLike, isDislike: isDislike ?? foundMark.isDislike}).end();
    }, 

    /**
     * Добавление вложения к статье
     * 
     * @param {object} req 
     * @param {object} res 
     */
    addAttachment: async function (req, res) {
        const {
            articleId
        } = req.body;

        const {
            file
        } = req;

        let foundArticle;
        if (!(foundArticle = await ArticleModel.findById(new Types.ObjectId(articleId)))) {
            return res.status(404).json({message: "Статьи с указанным ID не найдено"}).end();
        }

        let createdAttachment;
        if (!(createdAttachment = await ArticleAttachmentModel.create(
            {
                articleId: foundArticle._id,
                path: file.path 
            }
        ))) {
            return res.status(500).json({message: "Ошибка записи вложения в БД"}).end();
        }

        return res.status(200).json({attachemntId: createdAttachment._id}).end();
    },

    /**
     * Удаление вложения к статям
     * 
     * @param {object} req 
     * @param {object} res 
     * @returns
     */
    removeAttachment: async function (req, res) {
        const {
            attachmentId
        } = req.query;

        let foundAttachment;
        if (!(foundAttachment = await ArticleAttachmentModel.findById(new Types.ObjectId(attachmentId)))) {
            return res.status(404).json({message: "Вложения с указанным ID не найдено"}).end();
        }

        let foundArticle;
        if (!(foundArticle = await ArticleModel.findById(new Types.ObjectId(foundAttachment.articleId)))) {
            return res.status(404).json({message: "Статьи с указанным ID не найдено"}).end();
        }

        if (
            !req.account.role.isRoot &&
            !req.account.role.isModerator &&
            foundArticle.authorAccountId.toString() !== req.account._id.toString()
        ) {
            return res.status(403).json({message: "Ошибка доступа"}).end();
        }

        if (!(await foundAttachment.delete())) {
            return res.status(500).json({message: "Ошибка удаления вложения из БД"}).end();
        }

        return res.status(200).end();
    },

    /**
     * Удаление статей
     * 
     * @param {object} req 
     * @param {object} res
     * @returns 
     */
    remove: async function (req, res) {
        const {
            articleId
        } = req.query;

        let foundArticle;
        if (!(foundArticle = await ArticleModel.findById(new Types.ObjectId(articleId)))) {
            return res.status(404).json({message: "Статьи с указанным ID не найдено"}).end();
        }

        if (!(await foundArticle.delete())) {
            return res.status(500).json({message: "Ошибка удаления статьи из БД"}).end();
        }

        return res.status(200).end();
    },
}