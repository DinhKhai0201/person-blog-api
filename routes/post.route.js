const Router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const PostController = require('../controllers/post.controller');

Router.get('/all', PostController.getAll);
// Router.get('/getItem', PostController.getPostById);

// Router.get('/',AuthController.authorizeServiceProvider, PostController.getPost);
Router.post('/addOrUpdate',AuthController.authorizeServiceProvider, PostController.addOrUpdatePost);
// Router.post('/delete',AuthController.authorizeServiceProvider, PostController.deletePost);
module.exports = Router;