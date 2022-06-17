const {Schema, model} = require("mongoose");
const { accountRole } = require("./index");

const AccountRoleSchema = new Schema (
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        
        isRoot: {
            type: Boolean,
            default: false
        },

        isModerator: {
            type: Boolean,
            default: false
        },

        isVolunteer: {
            type: Boolean,
            default: false
        },

        isUser: {
            type: Boolean,
            default: true
        },
    }
);

module.exports = model(accountRole.name, AccountRoleSchema);