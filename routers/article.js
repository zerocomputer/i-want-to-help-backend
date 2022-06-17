const Router = require("express").Router;

const ValidatorUtils = require("../utils/validator");
const ArticleController = require("../controllers/article");

const AuthMiddleware = require("../middlewares/auth");
const MulterMiddleware = require("../middlewares/multer");

/**
 * Роутер системы аккаунтов
 * @author Nikita Sarychev
 */
module.exports = {
    router: Router(),

    init: function () {
        this.router.post(
            "/create", 
            [
                AuthMiddleware,
                ValidatorUtils.article.title,
                ValidatorUtils.article.text,
                ArticleController.create.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->создание успешно добавлен`);

        this.router.get(
            "/getList", 
            [
                AuthMiddleware,
                ValidatorUtils.account.accountId,
                ArticleController.getList.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->получение_списка_статей_аккаунта успешно добавлен`);

        this.router.get(
            "/getInfo", 
            [
                AuthMiddleware,
                ValidatorUtils.article.articleId,
                ArticleController.getInfo.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->получение_подробной_информации успешно добавлен`);

        this.router.patch(
            "/edit", 
            [
                AuthMiddleware,
                ValidatorUtils.article.articleId,
                ValidatorUtils.article.title,
                ValidatorUtils.article.text,
                ArticleController.edit.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->редактирование успешно добавлен`);

        this.router.post(
            "/sendComment", 
            [
                AuthMiddleware,
                ValidatorUtils.article.articleId,
                ValidatorUtils.article.text,
                ArticleController.sendComment.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->написание_комментария успешно добавлен`);

        this.router.patch(
            "/editComment", 
            [
                AuthMiddleware,
                ValidatorUtils.article.commentId,
                ValidatorUtils.article.text,
                ArticleController.editComment.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->редактирование_комментария успешно добавлен`);

        this.router.delete(
            "/removeComment", 
            [
                AuthMiddleware,
                ValidatorUtils.article.commentId,
                ArticleController.removeComment.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->удаление_комментария успешно добавлен`);

        this.router.patch(
            "/mark", 
            [
                AuthMiddleware,
                ValidatorUtils.article.articleId,
                ValidatorUtils.article.isLike,
                ArticleController.mark.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->оценка успешно добавлен`);

        this.router.post(
            "/addAttachment", 
            [
                AuthMiddleware,
                ValidatorUtils.article.articleId,
                MulterMiddleware.single("file"),
                ArticleController.addAttachment.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->добавление_вложения успешно добавлен`);

        this.router.delete(
            "/removeAttachment", 
            [
                AuthMiddleware,
                ValidatorUtils.article.attachmentId,
                ArticleController.removeAttachment.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->удаление_вложения успешно добавлен`);

        this.router.delete(
            "/remove", 
            [
                AuthMiddleware,
                ValidatorUtils.article.articleId,
                ArticleController.remove.bind(ArticleController)
            ]
        );

        console.log(`Метод Статья->удаление успешно добавлен`);
    },

    attach: function (app) {
        this.init();
        app.use("/article", this.router);
    }
}