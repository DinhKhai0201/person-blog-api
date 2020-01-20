const builder = require('botbuilder'),
    appConfig = require('../configs/app.config');

var customersBot = appConfig.spBot;
let bots = [];
let routeBotData;
// expose a designated Messaging Endpoint for each of the customers

let connector = new builder.ChatConnector({
    appId: customersBot.appId,
    appPassword: customersBot.appPassword
})
var azure = require('botbuilder-azure');

var docDbClient = new azure.DocumentDbClient(appConfig.botstatedb);
var tableStorage = new azure.AzureBotStorage({
    gzipData: true
}, docDbClient);

var bot = new builder.UniversalBot(connector).set('storage', tableStorage);
let tmpBot = {
    "botName": customersBot.botName,
    "bot": bot
};
bots.push(tmpBot);

routeBotData = {
    bot: bot,
    botName: customersBot.botName,
    connector: connector
}


module.exports.getRouteBotData = () => {
    return routeBotData;
}

module.exports.getAllBots = () => {
    return bots;
}

module.exports.getBotBybotName = (botName) => {
    for (var i = 0; i < bots.length; i++) {
        if (bots[i].botName == botName) {
            return bots[i].bot;
        }
    }
    return null;
}