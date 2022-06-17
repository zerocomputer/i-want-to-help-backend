require("dotenv").config();

const StartupArgumentsUtils = require("./utils/startupArguments");

const WebServer = require("./webServer");
const ConnectDatabase = require("./database/connect");
const PresetsDatabase = require("./database/presets");

ConnectDatabase.init();
ConnectDatabase.connect(async () => {
    if (StartupArgumentsUtils.getArgument("databaseReset")) {
        await PresetsDatabase();
    }

    WebServer.init();
    WebServer.start();
});