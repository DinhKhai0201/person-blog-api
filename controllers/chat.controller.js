const ChatService = require('../services/chat.service');

class PostController {
    sendMessage(req, res, next) {
        ChatService.sendMessage(req.body)
            .then(data => {
                res.json(data[0].queryResult.fulfillmentMessages[0].text.text[0]);
                // console.log(data)
            } )
            .catch(err => next(err));
    }

}
module.exports = new PostController()

