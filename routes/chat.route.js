const Router = require('express').Router();
const ChatController = require('../controllers/chat.controller');


// Router.get('/all', ChatController.getAll);
Router.get('/webhook', function (req, res) { // Đây là path để validate tooken bên app facebook gửi qua
    if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

Router.post('/webhook', ChatController.sendMessage)

module.exports = Router;