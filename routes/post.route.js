const Router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const PostController = require('../controllers/post.controller');

Router.get('/all', PostController.getAll);
Router.get('/getItem', PostController.getPostById);
Router.get('/my', AuthController.authorizeServiceUser, PostController.getMyPost);
Router.post('/incView', PostController.increaseView);
Router.get('/postByCat', PostController.getPostByCat);
Router.get('/search', PostController.searchPost);

Router.post('/addOrUpdate', AuthController.authorizeServiceUser, PostController.addOrUpdatePost);
Router.post('/delete',AuthController.authorizeServiceUser, PostController.deletePostById);
module.exports = Router;