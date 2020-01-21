const PostService = require('../services/post.service');
const fileService = require('../services/file.service');

class PostController {
    getAll(req, res, next) {
        PostService.getAll()
            .then(posts => res.json(posts))
            .catch(err => next(err));
    }

    getPost(req, res, next) {
        PostService.getPost(req.body.id)
            .then(post => res.json(post))
            .catch(err => next(err));
    }
    
    getPostById(req, res, next) {
        PostService.getPostById(req.query.id)
            .then(item => {
                res.json(item)
            })
            .catch(err => next(err));
    }
    
    addOrUpdatePost(req, res, next) {
        console.log(req);
        PostService.addOrUpdatePost(req.body.id, req.query.act, req.body)
            .then((success) => res.json(success))
            .catch(err => next(err));
    }
    
    deletePost(req, res, next) {
        PostService.deletePost(req.body.id, req.body)
            .then(rs => res.json(rs))
            .catch(err => next(err));
    }
    
    deletePostById(req, res, next) {
        PostService.deletePostById(req.body.id, req.query.id)
            .then(rs => res.json(rs))
            .catch(err => next(err));
    }

}
module.exports = new PostController()

