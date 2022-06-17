const Router = require("express").Router;

const ValidatorUtils = require("../utils/validator");
const AccountController = require("../controllers/account");

const ExpressValidatorMiddleware = require("../middlewares/express-validator");
const MulterMiddleware = require("../middlewares/multer");
const AuthMiddleware = require("../middlewares/auth");

/**
 * Роутер системы аккаунтов
 * @author Nikita Sarychev
 */
module.exports = {
    router: Router(),

    init: function () {
        this.router.post(
            "/register", 
            [
                ValidatorUtils.account.firstName,
                ValidatorUtils.account.lastName,
                ValidatorUtils.account.title,
                ValidatorUtils.account.email,
                ValidatorUtils.account.login,
                ValidatorUtils.account.password,
                ExpressValidatorMiddleware,
                AccountController.register.bind(AccountController)
            ]
        );

        console.log(`Метод Аккаунт->регистрация успешно добавлен`);

        this.router.post(
            "/login", 
            [
                ValidatorUtils.account.login,
                ValidatorUtils.account.password,
                ExpressValidatorMiddleware,
                AccountController.login.bind(AccountController)
            ]
        );

        console.log(`Метод Аккаунт->авторизация успешно добавлен`);

        this.router.get(
            "/getInfo", 
            [
                AuthMiddleware,
                AccountController.getInfo.bind(AccountController)
            ]
        );

        console.log(`Метод Аккаунт->получение_информации успешно добавлен`);

        this.router.get(
            "/getListNoConfirmed", 
            [
                AuthMiddleware,
                AccountController.getListNoConfirmed.bind(AccountController)
            ]
        );

        console.log(`Метод Аккаунт->получение_неподтверждённых успешно добавлен`);

        this.router.patch(
            "/confirm", 
            [
                ValidatorUtils.account.accountId,
                ExpressValidatorMiddleware,
                AuthMiddleware,
                AccountController.confirm.bind(AccountController)
            ]
        );

        console.log(`Метод Аккаунт->подтверждение успешно добавлен`);

        this.router.patch(
            "/edit", 
            [
                ValidatorUtils.account.firstName,
                ValidatorUtils.account.lastName,
                ValidatorUtils.account.title,
                MulterMiddleware.single("image"),
                // ExpressValidatorMiddleware,
                AuthMiddleware,
                AccountController.edit.bind(AccountController)
            ]
        );

        console.log(`Метод Аккаунт->редактирование успешно добавлен`);
    },

    attach: function (app) {
        this.init();
        app.use("/account", this.router);
    }
}