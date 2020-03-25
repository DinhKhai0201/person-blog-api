const mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    FormActions = constants.FormActions,
    cloudinaryService = require('../services/cloudinary.service'),
    Joi = require('joi'),
    appConfig = require('../configs/app.config'),
    fs = require('fs');

class PostService {
    getAll(limit,pageCur, type) {
        let option = {
            isActive: true,
            isDeleted: false
        }
        if (parseInt(type) == 1) { //admin
            option = {}
        }
        let  perPage = parseInt(limit || 1) ;
        let  page = parseInt(pageCur || 1) ;
        return new Promise((resolve, reject) => {
            Post.find(option).skip((perPage * page) - perPage)
            .limit(perPage)
            .populate("categoryId")
            .exec(function(err, post) {
                Post.count(option).exec(function(err, count) {
                    if (err) return reject(err) ;
                    return resolve({
                        data: post,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                   
                })
            })
        });
    }
    searchPost(keyword) {
        return new Promise((resolve, reject) => {
            console.log(keyword);
            Post.find({
                title: { $regex: keyword },
                isActive: true,
                isDeleted: false
            },
                { score: { $meta: "textScore" } }).populate("categoryId")
                .sort({ score: { $meta: "textScore" } })
                .then(post => resolve(post))
                .catch(err => reject(err));
        });
    }

    getPostById(id) {
        return new Promise((resolve, reject) => {
            console.log("category");
            Post.findOne({
                _id: id,
                isActive: true,
                isDeleted: false
            }).populate("categoryId")
                .then(post => resolve(post))
                .catch(err => reject(err));
        });
    }
    getPostByCat(id) {
        return new Promise((resolve, reject) => {
            console.log("cat");
            Post.findOne({
                categoryId: id,
                isActive: true,
                isDeleted: false
            }).populate("categoryId")
                .then(post => resolve(post))
                .catch(err => reject(err));
        });
    }
    addOrUpdatePost(userId, act, item) {
        return new Promise((resolve, reject) => {
            if (appConfig.stage == 'dev') {
                if (item && item.oldThumbnail) {
                    var pathImage = path.join(__dirname, '../public') + '/img/upload/post/' + item.oldThumbnail;
                    if (fs.existsSync(pathImage)) {
                        fs.unlink(pathImage, (err) => {
                            if (err) throw err;
                            console.log(pathImage, ' was deleted');
                        });
                    }
                }
            }
            // if (appConfig.stage == 'prod') {
            //     let imgNameWithoutExtention = item.oldThumbnail && item.oldThumbnail.split('.').length > 0 ? data.item.oldThumbnail.split('.')[0] : '';
            //     if (imgNameWithoutExtention) {
            //         let public_id = `menu/${imgNameWithoutExtention}`;
            //         cloudinaryService.delete(public_id);
            //     }
            // }
            /* validation */
            const validate = Joi.validate(item, {
                title: Joi.string().required(),
                slug: Joi.string().required(),
                content: Joi.any(),
                category: Joi.any().required()
            });
            if (validate.error) {
                return resolve({
                    message: validate.error.details[0].message
                });
            }
            User.findById(userId)
                .populate('user')
                .then(user => {
                    let newItem = item;
                    if ((newItem._id == undefined && act != FormActions.UpdateMany) || act == FormActions.Copy || ids.length == 0) {
                        newItem._id = mongoose.Types.ObjectId();
                        newItem.userId = userId;

                        Post.insertMany(newItem)
                            .then(() => resolve({
                                success: true
                            })).catch(err => reject(err));
                    } else {
                        var updateObj = {};
                        if (newItem.title != undefined) updateObj.title = newItem.title;
                        if (newItem.slug != undefined) updateObj.slug = newItem.slug;
                        if (newItem.content != undefined) updateObj.content = newItem.content;
                        if (newItem.tag != undefined) updateObj.tag = newItem.tag;
                        if (newItem.category != undefined) updateObj.category = newItem.category;

                        Post.update({
                            _id: newItem.id,
                            userId: userId,
                            updatedAt: new Date()
                        }, updateObj)
                            .then(() => {
                                resolve({
                                    success: true
                                })
                            }).catch(err => reject(err));
                    }
                }).catch(err => reject(err));
        });
    }

    getMyPost(userId) {
        return new Promise((resolve, reject) => {
            var query = {
                userId: userId,
                isDeleted: false
            }

            Post.find(query)
                .sort({
                    title: 1
                })
                .lean()
                .exec((err, posts) => {
                    resolve(posts)
                });
        })
    }

    countPost() {
        return new Promise((resolve, reject) => Post.count({})
            .then(count => resolve(count))
            .catch(err => reject(err)));
    }
    deletePost(userId, data) {
        return new Promise((resolve, reject) => {
            Post.update({
                _id: {
                    $in: data.ids
                },
                userId: userId
            }, {
                isDeleted: true
            }, {
                multi: true
            })
                .then(() => {
                    resolve({
                        success: true
                    })
                })
        });
    }

    deletePostById(userId, postId) {
        return new Promise((resolve, reject) => {
            Post.findOneAndUpdate({
                userId: userId,
                _id: postId
            }, {
                isDeleted: true
            })
                .then((post) => {
                    resolve({
                        success: true,
                        messsage: MessageConstants.SavedSuccessfully
                    })
                })
        });
    }

    updateActive(userId, postId) {
        return new Promise((resolve, reject) => {
            User.findOne({_id: userId})
                .then(user => {
                    if (user != null) {
                        console.log(user.role)
                        if (user.role == 1) { //role =1 admin
                            let value = Post.findOne({ _id: postId});
                            Post.update({
                                _id: postId
                            }, {
                                isActive: true
                            })
                                .then((post) => {
                                    resolve({
                                        success: true,
                                        messsage: MessageConstants.SavedSuccessfully
                                    })
                                })
                        } else {
                            resolve({
                                success: false,
                                messsage: MessageConstants.NotAllowChangeActive
                            })
                        }
                    }
                })
                .catch(err => reject(err));
           
        });
    }

    increaseView(postId, view) {
        return new Promise((resolve, reject) => {
            if (!postId) {
                reject({
                    error: false,
                    messsage: MessageConstants.SomethingGoesWrong
                })
            }
            Post.findOneAndUpdate({
                _id: postId,
                isActive: true,
                isDeleted: false
            }, {
                view: view
            })
                .then((post) => {
                    resolve({
                        success: true,
                        messsage: MessageConstants.SavedSuccessfully
                    })
                })
        });
    }

    checkPostName(userId, postName, postId) {
        return new Promise((resolve, reject) => {
            Post.findOne({
                userId: userId,
                title: postName,
                isDeleted: false,
            })
                .then(post => {
                    if ((!post) || (post && postId && postId == post._id.toString())) {
                        resolve({
                            success: true
                        })
                    } else {
                        resolve({
                            success: false,
                            message: MessageConstants.NameExistingError
                        })
                    }
                })
                .catch(err => reject(err));
        });
    }

}
module.exports = new PostService()