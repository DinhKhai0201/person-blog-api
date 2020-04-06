const constants = require('../configs/app.config');

class FacebookService {
    sendMessage(senderId, message) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: constants.facebook.PAGE_ACCESS_TOKEN,
            },
            method: 'POST',
            json: {
                recipient: {
                    id: senderId
                },
                message: {
                    text: message
                },
            }
        });
    }

}

module.exports = new FacebookService()