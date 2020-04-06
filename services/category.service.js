const mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    User = mongoose.model('User'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    FormActions = constants.FormActions,
    cloudinaryService = require('../services/cloudinary.service'),
    fs = require('fs');

class CategoryService {
    getAll(limit, pageCur, type) {
        let option = {
            isDeleted: false
        }
        if (parseInt(type) == 1) { //admin
            option = {}
        }
        let perPage = parseInt(limit || 1);
        let page = parseInt(pageCur || 1);
        return new Promise((resolve, reject) => {
            Category.find(option).skip((perPage * page) - perPage)
                .limit(perPage)
                .populate("categoryId")
                .exec(function (err, category) {
                    Category.count(option).exec(function (err, count) {
                        if (err) return reject(err);
                        return resolve({
                            data: category,
                            current: page,
                            pages: Math.ceil(count / perPage),
                            number: count
                        })

                    })
                })
        });
    }
    getParentCategory() {
        return new Promise((resolve, reject) => {
            Category.find({
                parentId: null
            })
                .then(category => resolve(category))
                .catch(err => reject(err));
        });
    }
    getParentCategoryWithChilds() {
        return new Promise((resolve, reject) => {
            Category.find({
                parentId: null
            }).populate("parentId")
                .then(category => resolve(category))
                .catch(err => reject(err));
        });
    }

    getCategoryById(id) {
        return new Promise((resolve, reject) => {
            Category.findOne({
                _id: id,
                isDeleted: false
            }).populate("parentId")
                .then(category => resolve(category))
                .catch(err => reject(err));
        });
    }

    addOrUpdateCategory(user, act, item) {
        return new Promise((resolve, reject) => {
            User.findById(userId)
                .then(user => {
                    if (user && user.role == 1) {
                        let newItem = item;
                        if ((newItem._id == undefined && act != FormActions.UpdateMany) || act == FormActions.Copy || ids.length == 0) {
                            newItem._id = mongoose.Types.ObjectId();
                            Category.insertMany(newItem)
                                .then(() => resolve({
                                    success: true
                                })).catch(err => reject(err));
                        } else {
                            var updateObj = {};
                            if (newItem.name != undefined) updateObj.name = newItem.name;
                            if (newItem.logo != undefined) updateObj.logo = newItem.logo;
                            if (newItem.slug != undefined) updateObj.slug = newItem.slug;
                            if (newItem.description != undefined) updateObj.description = newItem.description;
                            if (newItem.parentId != undefined) updateObj.parentId = newItem.parentId;
                            updateObj.updatedAt = new Date();
                            Category.update({
                                _id: newItem.id
                            }, updateObj)
                                .then(() => {
                                    resolve({
                                        success: true
                                    })
                                }).catch(err => reject(err));
                        }
                    }
                })


        });
    }

    countCategory() {
        return new Promise((resolve, reject) => Category.count({})
            .then(count => resolve(count))
            .catch(err => reject(err)));
    }
    updateActive(userId, id, isActive) {
        return new Promise((resolve, reject) => {
            User.findOne({ _id: userId })
                .then(user => {
                    if (user != null) {
                        if (user.role == 1) { //role =1 admin
                            // 0 is false, 1 is true
                            let option = {
                                isActive: true
                            }
                            if (isActive == 1) {
                                option = {
                                    isActive: false
                                }
                            }

                            Category.update({
                                _id: id
                            }, option)
                                .then((category) => {
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
    deleteCategory(userId, data) {
        return new Promise((resolve, reject) => {
            User.findById(userId)
                .then(user => {
                    if (user && user.role == 1) {
                        Category.update({
                            _id: {
                                $in: data.ids
                            },
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
                    }
                })

        });
    }
    deleteCategoryById(userId, categoryId) {
        return new Promise((resolve, reject) => {
            User.findById(userId)
                .then(user => {
                    if (user && user.role == 1) {
                        Category.findOneAndUpdate({
                            _id: categoryId
                        }, {
                            isDeleted: true
                        })
                            .then((category) => {
                                resolve({
                                    success: true,
                                    messsage: MessageConstants.SavedSuccessfully
                                })
                            })
                    }
                })

        });
    }

}
module.exports = new CategoryService()