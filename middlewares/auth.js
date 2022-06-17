const jwt = require("jsonwebtoken");
const { Types } = require("mongoose");

const References = require("../models/index");
const AccountModel = require("../models/account");
const AccountRoleModel = require("../models/accountRole");
const AccountSessionModel = require("../models/accountSession");

/**
 * Промежуточная валидация токена
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 * @author Nikita Sarychev
 */
module.exports =  async (req, res, next) => {
    // Проверка наличия заголовков
    if (!req.headers)
        return res.status(401).json({message: "Headers undefined"}).end();
    // Проверка наличия авторизации
    if (!req.headers.authorization)
        return res.status(401).json({message: "Token not sent"}).end();
    
    // Проверка токена на валидность
    let decodedToken;
    try {
        decodedToken = jwt.decode(req.headers.authorization);
    } catch (e) {
        return res.status(403).json({message: "Token invalid: " + e}).end();
    }

    // Получение сессии
    let foundSession;
    try {
        if (!(foundSession = await AccountSessionModel.findById(new Types.ObjectId(decodedToken.sessionId))))
            return res.status(403).json({message: "Session unavailable"}).end();

        // Верификация сессии
        const currentTimestamp = Math.floor(Date.now()/1000);
        if (currentTimestamp > foundSession.expiresIn) {
            await AccountSessionModel.findByIdAndDelete(new Types.ObjectId(foundSession));
            return res.status(403).json({message: "Session was expires"}).end();
        }

        req.accountSession = foundSession;
    } catch (e) {
        return res.status(400).json({message: "SessionId invalid"}).end();
    }

    // Получение аккаунта
    let foundAccount;
    try {
        if (!(foundAccount = await AccountModel.aggregate(
            [
                {
                    $match: {
                        _id: foundSession.accountId
                    }
                },
                {
                    $project: {
                        passwordHash: 0,
                        __v: 0
                    }
                },
                {
                    $lookup: {
                        from: References.accountRole.name,
                        localField: "accountRoleId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    __v: 0
                                }
                            },
                            {
                                $limit: 1
                            }
                        ],
                        as: "role"
                    }
                },
                {
                    $unwind: "$role"
                },
                {
                    $limit: 1
                }
            ]
        ))) { 
            return res.status(403).json({message: "Account unavailable"}).end();
        }
        
        req.account = foundAccount[0];

        if (!req.account.isConfirmed) {
            return res.status(403).json({message: "Аккаунт не одобрен администратором сервера, ожидайте"}).end();
        }
    } catch (e) {
        return res.status(500).json({message: "AccountId invalid: " + e}).end();
    }

    next();
}