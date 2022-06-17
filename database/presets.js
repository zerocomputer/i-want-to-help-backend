const bcrypt = require("bcrypt");
const AccountModel = require("../models/account");
const AccountRoleModel = require("../models/accountRole");

const accountRoles = [
    {
        name: "root",
        isRoot: true
    },
    {
        name: "moderator",
        isModerator: true,
        isUser: false
    },
    {
        name: "volunteer",
        isVolunteer: true
    },
    {
        name: "user",
        isUser: true
    }
]

const accountData = {
    accountRoleId: null,
    email: "admin@iwanttohelp.ru",
    login: "admin",
    password: "adminadmin",
}

module.exports = async () => {
    for (let role of accountRoles) {
        try {
            let foundRole;
            if ((foundRole = await AccountRoleModel.findOne({name: role.name}))) {
                foundRole.delete();
            }

            foundRole = await AccountRoleModel.create(role);
            
            if (role.name === "root") {
                accountData.accountRoleId = foundRole._id;
            }

            console.log(`Роль "${role.name}" успешно добавлена`);
        } catch (e) {
            console.log(`Ошибка добавления роли "${role.name}": ${e}`);
        }
    }

    try {
        let foundAccount;
        if ((foundAccount = await AccountModel.findOne({email: accountData.email, login: accountData.login}))) {
            foundAccount.delete();
        }

        await AccountModel.create({
            accountRoleId: accountData.accountRoleId,
            firstName: "Администратор", 
            lastName: "сервиса", 
            title: "НКО 'ХочуПомочь56'", 
            email: accountData.email, 
            login: accountData.login, 
            passwordHash: bcrypt.hashSync(accountData.password, 2), 
            isConfirmed: true
        });

        console.log(`Аккаунт "${accountData.login}" успешно добавлен`);
    } catch (e) {
        console.log(`Ошибка добавления аккаунта "${accountData.login}": ${e}`);
    }
}