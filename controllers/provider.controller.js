const ProviderService = require('../services/provider.service');
const fileService = require('../services/file.service');
const bookService = require('../services/book.service');
const shipService = require('../services/ship.service');

class ProviderController {
    async addDeviceToken(req, res, next) {
        ProviderService.addDeviceToken(req.body.id, req.body)
            .then((success) => res.json(success))
            .catch(err => next(err));
    }

    async getProviderById(req, res) {
        const provider = await ProviderService.getById(req.body.id);
        res.json(provider)
    }

    async uploadImge(req, res, next) {
        fileService.uploadFile(req).then(file => {
            res.json(file);
        }).catch(err => next(err));
    }

    async updateProvider(req, res) {
        ProviderService.updateInfo(req.body.id, req.body.providerInf).then(data => {
            res.json(data)
        })
    }

    async checkPassword(req, res) {
        ProviderService.checkPassword(req.body.id, req.query.password).then(data => {
            res.json(data);
        })
    }

    async checkUserNameExist(req, res) {
        ProviderService.checkUserNameExist(req.query.username).then(data => {
            res.json(data);
        })
    }

    async checkCodeResetPassword(req, res) {
        ProviderService.checkCodeResetPassword(req.query.username, req.query.code).then(data => {
            res.json(data);
        })
    }

    async updatePassword(req, res) {
        ProviderService.updatePassword(req.body.id, req.body.newPassword, req.body.oldPassword).then(data => {
            res.json(data)
        })
    }

    async resetPassword(req, res) {
        ProviderService.resetPassword(req.body.username, req.body.newPassword, req.body.code).then(data => {
            res.json(data)
        })
    }

    getBooks(req, res, next) {
        bookService.getBooks(req.body.id, req.body)
            .then(data => {
                res.json({
                    success: true,
                    data: data.books,
                    totalPage: data.page
                })
            })
            .catch(err => next(err));
    }

    updateBookById(req, res, next) {
        bookService.addOrUpdateBook(req.body)
            .then((success) => res.json(success))
            .catch(err => next(err));
    }

    getShips(req, res, next) {
        shipService.getShips(req.body.id, req.body)
            .then(data => {
                res.json({
                    data: data.ships,
                    totalPage: data.page,
                    costShip: data.costShip
                })
            })
            .catch(err => next(err));
    }

    updateShipById(req, res, next) {
        shipService.addOrUpdateShip(req.body)
            .then((success) => res.json(success))
            .catch(err => next(err));
    }

    deleteShip(req, res, next) {
        shipService.deleteShip(req.body.id, req.query.id)
            .then((success) => res.json(success))
            .catch(err => next(err));
    }

    getNotifications(req, res, next) {
        notificationService.getNotifications(req.body.id, req.body)
            .then(data => {
                res.json({
                    data: data.notifications,
                    totalPage: data.page
                })
            })
            .catch(err => next(err));
    }

    markAsReadNotifications(req, res, next) {
        notificationService.markAsReadNotifications(req.body.id, req.query.type)
            .then(rs => {
                res.json(rs)
            })
            .catch(err => next(err));
    }

    // addDeviceToken(req, res, next) {
    //     providerService.addDeviceToken(req.body.id, req.body)
    //         .then((success) => res.json(success))
    //         .catch(err => next(err));
    // }

    getAnswerFaqs(req, res, next) {
        answerFaqService.getAll(req.body.id)
            .then(rs => res.json(rs))
            .catch(err => next(err));
    }

    updateAnswerFaq(req, res, next) {
        answerFaqService.update(req.body)
            .then(rs => res.json(rs))
            .catch(err => next(err));
    }

}
module.exports = new ProviderController()

