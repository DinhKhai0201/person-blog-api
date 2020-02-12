const mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    FormActions = constants.FormActions,
    cloudinaryService = require('../services/cloudinary.service'),
    fs = require('fs');

class PostService {
    getAll() {
        return new Promise((resolve, reject) => {
            Post.find({
                isActive: true,
                isDeleted: false
            })
                .then(post => resolve(post))
                .catch(err => reject(err));
        });
    }
    
    getPostById(id) {
        return new Promise((resolve, reject) => {
            console.log("asdasdasd");
            Post.findOne({
                _id: id,
                isActive: true,
                isDeleted: false
            }).populate('categories')
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
                            userId: userId
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
    
    
    deletePost (userId, data) {
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
            Post.findOneAndUpdate({
                userId: userId,
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