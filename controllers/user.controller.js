const UserService = require('../services/user.service');
const fileService = require('../services/file.service');

class UserController {
    async addDeviceToken(req, res, next) {
        UserService.addDeviceToken(req.body.id, req.body)
            .then((success) => res.json(success))
            .catch(err => next(err));
    }
    countUser(req, res, next) {
        UserService.countUser()
            .then(count => res.json(count))
            .catch(err => next(err));
    }
    getAll(req, res, next) {
        UserService.getAll(req.query.limit,req.query.page,req.query.type)
            .then(user => res.json(user))
            .catch(err => next(err));
    }
   
    getUserById(req, res, next) {
        UserService.getUserById(req.query.id)
            .then(user => {
                res.json(user)
            })
            .catch(err => next(err));
    }
    updateActive(req, res, next) {
        UserService.updateActive(req.body.id, req.query.id, req.query.isActive)
            .then(user => res.json(user))
            .catch(err => next(err));
    }
    async uploadImge(req, res, next) {
        fileService.uploadFile(req).then(file => {
            res.json(file);
        }).catch(err => next(err));
    }
    updateUser(req, res, next) {
        UserService.updateUser(req.body.id, req.body)
            .then(user => res.json(user))
            .catch(err => next(err));
    }
  

    async checkPassword(req, res) {
        UserService.checkPassword(req.body.id, req.query.password).then(data => {
            res.json(data);
        })
    }

    async checkUserNameExist(req, res) {
        UserService.checkUserNameExist(req.query.username).then(data => {
            res.json(data);
        })
    }

    async checkCodeResetPassword(req, res) {
        UserService.checkCodeResetPassword(req.query.email, req.query.code).then(data => {
            res.json(data);
        })
    }

    async updatePassword(req, res) {
        UserService.updatePassword(req.body.id, req.body.newPassword, req.body.oldPassword).then(data => {
            res.json(data)
        })
    }

    async resetPassword(req, res) {
        UserService.resetPassword(req.body.email, req.body.newPassword, req.body.code).then(data => {
            res.json(data)
        })
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
}
module.exports = new UserController()


