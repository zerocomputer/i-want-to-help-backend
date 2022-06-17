const {Schema, Types, model} = require("mongoose");
const { account, accountRole } = require("./index");

const AccountSchema = new Schema (
    {
        accountRoleId: {
            type: Types.ObjectId,
            ref: accountRole.name,
            required: true
        },

        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        image: {
            type: String,
        },

        email: {
            type: String,
            required: true
        },

        login: {
            type: String,
            required: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        isConfirmed: {
            type: Boolean,
            default: false
        }
    }
);

module.exports = model(account.name, AccountSchema);