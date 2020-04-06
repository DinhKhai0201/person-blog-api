const constants = require('../configs/app.config'),
    dialogflowService = require('../services/dialogflow.service');

class ChatService {
    async sendMessage(body) {
            try {
                let query = await dialogflowService.sendTextMessageToDialogFlow(body.title, "121212");
                return query
            }
            catch(err) {
                throw err
            }
            // console.log(query)
            // var entries = body.entry;
            // for (var entry of entries) {
            //     var messaging = entry.messaging;
            //     for (var message of messaging) {
            //         var senderId = message.sender.id;
            //         if (message.message) {
            //             let text = message.message.text;
            //             console.log(text)
            //             // if (text == "thứ 6" || text == "thứ 6 làm gì") {
            //             //     sendMessage(senderId, "nấu ăn ");
            //             // }

            //         }
            //     }
            // }

            // resolve({
            //     status: true,
            //     query: query
            // })
            // // res.status(200).send("OK");
    }

}

module.exports = new ChatService()