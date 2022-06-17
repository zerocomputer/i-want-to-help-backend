/**
 * Начальный индекс передаваемых аргументов
 * запуска
 */
const argStartIndex = 2;

/**
 * Утилита получения агрументов запуска
 * @author Nikita Sarychev
 */
module.exports = {
    /**
     * Получение аргумента из переменных окружения
     * @param {string} name 
     * @returns 
     */
    getEnvArg (name) {
        return process.env[name] ?? false;
    },

    /**
     * Получение аргумента из параметров запуска
     * @param {string} name 
     * @returns 
     */
    getProcessArg (name) {
        const argIndex = process.argv.indexOf(`--${name}`);
        return (argIndex !== -1) ? (process.argv[argIndex + 1] === "true" ? true : process.argv[argIndex + 1]) ?? false : false;
    }, 
    
    /**
     * Получение аргумента
     * @param {string} name 
     * @param {any} value
     * @returns
     */
    getArgument (name, value = false) {
        let arguemnt;
        if (!(arguemnt = this.getProcessArg(name))) {
            if(!(arguemnt = this.getEnvArg(name))) {
                arguemnt = value;
            }
        }

        return arguemnt;
    }
}