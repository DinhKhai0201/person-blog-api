const CategoryService = require('../services/category.service');

class CategoryController {
  
    getAll(req, res, next) {
        CategoryService.getAll(req.query.limit,req.query.page,req.query.type)
            .then(posts => res.json(posts))
            .catch(err => next(err));
    }
    countCategory(req, res, next) {
        CategoryService.countCategory()
            .then(count => res.json(count))
            .catch(err => next(err));
    }
    getCategoryById(req, res, next) {
        CategoryService.getCategoryById(req.query.id)
            .then(post => {
                res.json(post)
            })
            .catch(err => next(err));
    }

    getParentCategoryWithChilds(req, res) {
        CategoryService.getParentCategoryWithChilds().then(result => {
            res.json(result)
        }).catch(err => next(err));
    }  

    getParentCategory(req, res) {
        CategoryService.getParentCategory().then(result => {
            res.json(result)
        }).catch(err => next(err));
    }   
    addOrUpdateCategory(req, res, next) {
        CategoryService.addOrUpdateCategory(req.body.id, req.query.act, req.body)
            .then((success) => res.json(success))
            .catch(err => next(err));
    }
    
    deleteCategoryById(req, res, next) {
        CategoryService.deleteCategoryById(req.body.id,req.query.id)
            .then(rs => res.json(rs))
            .catch(err => next(err));
    }

}
module.exports = new CategoryController()

