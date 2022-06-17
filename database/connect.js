const mongoose = require("mongoose");

const ModelsLoader = require("./modelsLoader");
const StartupArgumentsUtils = require("../utils/startupArguments");

module.exports = {
    arguments: {
        DATABASE_URL: false,
        DATABASE_USER: false,
        DATABASE_PASSWORD: false
    },

    init: function () {
        for (let key in this.arguments) {
            const argumentValue = StartupArgumentsUtils.getArgument(key);

            if (argumentValue) {
                this.arguments[key] = argumentValue;
            } else {
                throw Error(`Ошибка получения аргумента "${key}"`);
            }
        }
    },

    connect: function(callbackFunction = function(){}) {
        if (typeof callbackFunction !== "function") {
            throw Error(`Переданная коллбек-функция недействительна (is ${typeof callbackFunction})`);
        }

        try {
            mongoose
            .connect(
                this.arguments.DATABASE_URL, 
                {
                    user: this.arguments.DATABASE_USER,
                    pass: this.arguments.DATABASE_PASSWORD,
                    autoCreate: true
                },

                () => {
                    console.log(`Подключение к базе данных успешно`);

                    ModelsLoader();

                    callbackFunction ();
                }
            )
        } catch (e) {
            console.log(`Ошибка подключения к базе данных: "${e}"`);
        }
        
    }
}