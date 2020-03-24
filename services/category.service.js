const mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    User = mongoose.model('User'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    FormActions = constants.FormActions,
    cloudinaryService = require('../services/cloudinary.service'),
    fs = require('fs');

class CategoryService {
    getAll() {
        return new Promise((resolve, reject) => {
            Category.find({
                isDeleted: false
            }).populate("parentId")
                .then(category => resolve(category))
                .catch(err => reject(err));
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
            // if (appConfig.stage == 'dev') {
            //     if (item && item.oldThumbnail) {
            //         var pathImage = path.join(__dirname, '../public') + '/img/upload/menu/' + item.oldThumbnail;
            //         if (fs.existsSync(pathImage)) {
            //             fs.unlink(pathImage, (err) => {
            //                 if (err) throw err;
            //                 console.log(pathImage, ' was deleted');
            //             });
            //         }
            //     }
            // }
            // if (appConfig.stage == 'prod') {
            //     let imgNameWithoutExtention = item.oldThumbnail && item.oldThumbnail.split('.').length > 0 ? data.item.oldThumbnail.split('.')[0] : '';
            //     if (imgNameWithoutExtention) {
            //         let public_id = `menu/${imgNameWithoutExtention}`;
            //         cloudinaryService.delete(public_id);
            //     }
            // }
            let newItem = item;
            console.log(newItem);
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

                Category.update({
                    _id: newItem.id
                }, updateObj)
                    .then(() => {
                        resolve({
                            success: true
                        })
                    }).catch(err => reject(err));
            }

        });
    }


    deleteCategoryById(categoryId) {
        return new Promise((resolve, reject) => {
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
        });
    }

}
module.exports = new CategoryService()