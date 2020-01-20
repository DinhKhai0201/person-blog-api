const Router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const ProviderController = require('../controllers/provider.controller');
Router.get('/logout', AuthController.authorizeServiceProvider, AuthController.logout);
Router.post('/deviceToken/add', AuthController.authorizeServiceProvider, ProviderController.addDeviceToken);
// Router.post('/image/upload', ProviderController.uploadImage);
Router.get('/password', AuthController.authorizeServiceProvider, ProviderController.checkPassword)
Router.get('/username', AuthController.authorizeServiceProvider, ProviderController.checkUserNameExist)
Router.get('/code', ProviderController.checkCodeResetPassword)
Router.post('/password', AuthController.authorizeServiceProvider, ProviderController.updatePassword)
Router.get('/', AuthController.authorizeServiceProvider, ProviderController.getProviderById);
Router.post('/', AuthController.authorizeServiceProvider, ProviderController.updateProvider)
Router.post('/password/reset', ProviderController.resetPassword);
Router.post('/image/upload', ProviderController.uploadImge);
Router.post('/books/getBooks', ProviderController.getBooks);
Router.post('/books/updateBook', ProviderController.updateBookById);
// SHIP
Router.post('/ships/getShips', ProviderController.getShips);
Router.post('/ships/updateShip', ProviderController.updateShipById);
Router.get('/ships/delete', ProviderController.deleteShip);
module.exports = Router;