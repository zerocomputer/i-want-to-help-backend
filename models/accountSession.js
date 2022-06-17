const {Schema, Types, model} = require("mongoose");
const { account, accountSession } = require("./index");

const AccountSessionSchema = new Schema (
    {
        accountId: {
            type: Types.ObjectId,
            ref: account.name,
            required: true
        },
        
        expiresIn: {
            type: Number,
            required: true
        }
    }
);

module.exports = model(accountSession.name, AccountSessionSchema);