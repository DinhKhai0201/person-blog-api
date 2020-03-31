const PostService = require('../services/post.service');

class PostController {
    getAll(req, res, next) {
        PostService.getAll(req.query.limit, req.query.page, req.query.type)
            .then(posts => res.json(posts))
            .catch(err => next(err));
    }
    countPost(req, res, next) {
        PostService.countPost()
            .then(count => res.json(count))
            .catch(err => next(err));
    }
    getPost(req, res, next) {
        PostService.getPost(req.body.id)
            .then(post => res.json(post))
            .catch(err => next(err));
    }
    getPostByCat(req, res, next) {
        PostService.getPostByCat(req.query.id)
            .then(post => res.json(post))
            .catch(err => next(err));
    }
    getPostById(req, res, next) {
        PostService.getPostById(req.query.id)
            .then(post => {
                res.json(post)
            })
            .catch(err => next(err));
    }
    searchPost(req, res, next) {
        PostService.searchPost(req.query.keyword)
            .then(post => {
                res.json(post)
            })
            .catch(err => next(err));
    }
    getMyPost(req, res, next) {
        PostService.getMyPost(req.body.id)
            .then(post => {
                res.json(post)
            })
            .catch(err => next(err));
    }

    addOrUpdatePost(req, res, next) {
        console.log(req.body)
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
    updateActive(req, res, next) {
        PostService.updateActive(req.body.id, req.query.id, req.query.isActive)
            .then(post => res.json(post))
            .catch(err => next(err));
    }
    increaseView(req, res, next) {
        PostService.increaseView(req.query.id, req.query.view)
            .then(post => res.json(post))
            .catch(err => next(err));
    }

}
module.exports = new PostController()

