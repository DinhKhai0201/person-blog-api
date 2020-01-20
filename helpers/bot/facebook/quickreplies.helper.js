// const _trans = require('../../../services/localization.service'),
const sessionHelper = require('../../../helpers/bot/facebook/session.helper'),
    constants = require('../../../common/constants'),
    FloatingButtons = constants.FloatingButtons;

module.exports.buildQuickReply = (title, payload) => {
    return {
        content_type: "text",
        title: title,
        payload: payload
    }
}

module.exports.buildMainQuickReplies = (session) => {
    let floatingButtons = [FloatingButtons.ChatWithAdmin, FloatingButtons.Promotion, FloatingButtons.Ship, FloatingButtons.Reservation, FloatingButtons.Contact, FloatingButtons.Menu, FloatingButtons.AboutUs]
    return this.buildQuickRepliesSPBot(session, floatingButtons);
}

module.exports.buildQuickRepliesSPBot = (session, floatingButtons) => {
    let quick_replies = [];
    let lang = sessionHelper.getLanguageFromSession(session);
    if (floatingButtons && floatingButtons.length > 0) {
        floatingButtons.forEach((btn) => {
            switch (btn) {
                case FloatingButtons.Promotion:
                    quick_replies.push(this.buildQuickReply("Khuyến mãi", constants.COMMAND_PROMOTION));
                    break;
                case FloatingButtons.Menu:
                    quick_replies.push(this.buildQuickReply("Thực đơn", constants.COMMAND_MENU));
                    break;
                case FloatingButtons.Reservation:
                    quick_replies.push(this.buildQuickReply("Đặt bàn", constants.COMMAND_RESERVATION));
                    break;
                case FloatingButtons.AboutUs:
                    quick_replies.push(this.buildQuickReply("Về Chúng tôi", constants.COMMAND_ABOUT_US));
                    break;
                case FloatingButtons.ChatWithAdmin:
                    quick_replies.push(this.buildQuickReply("Chat với admin", constants.COMMAND_CHAT_WITH_ADMIN));
                    break;
                case FloatingButtons.StopChatting:
                    quick_replies.push(this.buildQuickReply("Ngừng chat", constants.COMMAND_STOP_CHATTING));
                    break;
                case FloatingButtons.Ship:
                    quick_replies.push(this.buildQuickReply("Giao hàng", constants.COMMAND_SHIP));
                    break;
                case FloatingButtons.Contact:
                    quick_replies.push(this.buildQuickReply("Gọi điện", constants.COMMAND_CONTACT_US));
                    break;
            }
        })
    }
    return quick_replies;
}