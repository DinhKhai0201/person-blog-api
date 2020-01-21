const Router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const PostController = require('../controllers/post.controller');

Router.get('/logout', AuthController.authorizeServiceUser, AuthController.logout); //
Router.post('/deviceToken/add', AuthController.authorizeServiceUser, UserController.addDeviceToken);

Router.get('/password', AuthController.authorizeServiceUser, UserController.checkPassword)
Router.get('/username', AuthController.authorizeServiceUser, UserController.checkUserNameExist)
Router.get('/code', UserController.checkCodeResetPassword)
Router.post('/password', AuthController.authorizeServiceUser, UserController.updatePassword)
Router.get('/', AuthController.authorizeServiceUser, UserController.getUserById);
Router.post('/', AuthController.authorizeServiceUser, UserController.updateUser)
Router.post('/password/reset', UserController.resetPassword);
Router.post('/image/upload', UserController.uploadImge);

module.exports = Router;