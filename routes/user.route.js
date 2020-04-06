const Router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const PostController = require('../controllers/post.controller');

Router.get('/all', UserController.getAll);

Router.get('/logout', AuthController.authorizeServiceUser, AuthController.logout); //
Router.post('/deviceToken/add', AuthController.authorizeServiceUser, UserController.addDeviceToken);

Router.get('/countUser', UserController.countUser)
Router.get('/password', AuthController.authorizeServiceUser, UserController.checkPassword)
Router.get('/username', AuthController.authorizeServiceUser, UserController.checkUserNameExist)
Router.get('/code', UserController.checkCodeResetPassword)
Router.post('/password', AuthController.authorizeServiceUser, UserController.updatePassword)
Router.get('/getById',AuthController.authorizeServiceUser, UserController.getUserById);
Router.post('/update', AuthController.authorizeServiceUser, UserController.updateUser)
Router.post('/password/reset', UserController.resetPassword);
Router.post('/image/upload', UserController.uploadImge);
// post
Router.post('/changeActive', AuthController.authorizeServiceUser, PostController.updateActive)
Router.post('/changeActiveUser', AuthController.authorizeServiceUser, UserController.updateActive)
module.exports = Router;