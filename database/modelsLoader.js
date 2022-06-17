const fs = require("fs");
const path = require("path");
const ModelsReferences = require("../models");

/**
 * Модуль загрузи моделей базы данных
 */
module.exports = () => {
    const pathToModels = `${__dirname}/../models`;

    for (let fileName of fs.readdirSync(pathToModels)) {
        if (fileName === "index.js") {
            continue;
        }

        const modelReference = ModelsReferences[path.parse(fileName).name];
        try {
            require(`${pathToModels}/${fileName}`);

            console.log(`Модель "${modelReference.title}" успешно загружена`);
        } catch (e) {
            console.log(`Критическая ошибка загрузки модели "${modelReference.title}": ${e}`);
        }
    }
}