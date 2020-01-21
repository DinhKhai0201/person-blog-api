const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const constants = require('../common/constants');
const MessageConstants = constants.MessageConstants;
const fs = require('fs');

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
    
    getById(id) {
        return new Promise((resolve, reject) => {
            Post.findOne({
                _id: id
            })
                .then(post => resolve(post))
                .catch(err => reject(err));
        });
    }
    
    addOrUpdatePost(userId, act, data) {
        return new Promise((resolve, reject) => {
            if (appConfig.stage == 'dev') {
                if (data.item && data.item.oldThumbnail) {
                    var pathImage = path.join(__dirname, '../public') + '/img/upload/menu/' + data.item.oldThumbnail;
                    if (fs.existsSync(pathImage)) {
                        fs.unlink(pathImage, (err) => {
                            if (err) throw err;
                            console.log(pathImage, ' was deleted');
                        });
                    }
                }
            }
            if (appConfig.stage == 'prod') {
                let imgNameWithoutExtention = data.item.oldThumbnail && data.item.oldThumbnail.split('.').length > 0 ? data.item.oldThumbnail.split('.')[0] : '';
                if (imgNameWithoutExtention) {
                    let public_id = `menu/${imgNameWithoutExtention}`;
                    cloudinaryService.delete(public_id);
                }
            }
            Post.findById(userId)
                .populate('user')
                .then(user => {
                    let newItem = data.item;
                    if ((newItem._id == undefined && act != FormActions.UpdateMany) || act == FormActions.Copy || ids.length == 0) {
                        newItem._id = mongoose.Types.ObjectId();
                        newItem.userId = userId;
    
                        Post.insertMany([newItem])
                            .then(() => resolve({
                                success: true
                            }));
                    } else {
                        var updateObj = {};
                        if (newItem.title != undefined) updateObj.title = newItem.title;
                        if (newItem.slug != undefined) updateObj.slug = newItem.slug;
                        if (newItem.content != undefined) updateObj.content = newItem.content;
                        if (newItem.tag != undefined) updateObj.tag = newItem.tag;
                        if (newItem.category != undefined) updateObj.category = newItem.category;
    
                        Post.update({
                            _id: {
                                $in: ids
                            },
                            userId: userId
                        }, updateObj, {
                                multi: true
                            })
                            .then(() => {
                                resolve({
                                    success: true
                                })
                            })
                    }
                })
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
    
    deletePostById (userId, postId) {
        return new Promise((resolve, reject) => {
            Post.findOneAndUpdate({
                userId: userId,
                _id: postId
            }, {
                    isDeleted: true
                })
                .then((post) => {
                    if (appConfig.stage == 'prod') {
                        let imgNameWithExtention = post.thumbnail && post.thumbnail.split('.').length > 0 ? post.thumbnail.split('.')[0] : '';
                        if (imgNameWithExtention) {
                            let public_id = `post/${imgNameWithExtention}`;
                            cloudinaryService.delete(public_id);
                        }
                    }
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