const { check } = require("express-validator");

/**
 * Модуль валидации
 * @author Nikita Sarychev
 */
module.exports = {
    /**
     * Система аккаунтов
     */
    account: {
        accountId: check("accountId")
            .exists()
            .isMongoId(),
        firstName: check("firstName")
            .trim()
            .notEmpty()
            .isString()
            .isLength({min: 3, max: 45}),
        lastName: check("lastName")
            .trim()
            .notEmpty()
            .isString()
            .isLength({min: 3, max: 45}),
        title: check("title")
            .trim()
            .notEmpty()
            .isString(),
        login: check("login")
            .trim()
            .notEmpty()
            .isString()
            .isLength({min: 4, max: 30}),
        email: check("email")
            .trim()
            .notEmpty()
            .isString()
            .isEmail(),
        password: check("password")
            .exists()
            .trim()
            .notEmpty()
            .isString()
            .isLength({min: 6, max: 25}) 
    },

    /**
     * Система новостей
     */
    article: {
        articleId: check("articleId")
            .exists()
            .isMongoId(),
        attachmentId: check("attachmentId")
            .exists()
            .isMongoId(),
        commentId: check("commentId")
            .exists()
            .isEmpty()
            .isString()
            .trim()
            .isEmpty(),
        title: check("title")
            .exists()
            .isEmpty()
            .isString()
            .trim()
            .isEmpty()
            .isLength({min: 4, max: 30}),
        text: check("text")
            .exists()
            .isEmpty()
            .isString()
            .trim()
            .isEmpty()
            .isEmail(),
        password: check("password")
            .isEmpty()
            .isString()
            .trim()
            .isEmpty()
            .isLength({min: 6, max: 25}),
        isLike: check("isLike")
            .exists()
            .isBoolean(),
    }
}