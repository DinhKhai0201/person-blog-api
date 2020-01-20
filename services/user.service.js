const mongoose = require('mongoose');
const passwordHelper = require('../helpers/password.helper');
const User = mongoose.model('User');
const constants = require('../common/constants');
const MessageConstants = constants.MessageConstants;
const fs = require('fs');

class UserService {
    register(host, p) {
        return new Promise((resolve, reject) => {
            fs.readFile('temp/default_sp.json', 'utf8', function (err, data) {
                if (err) throw err;
                let sp = JSON.parse(data);
                var username = p.username.toLowerCase();
                User.findOne({
                    username: username
                })
                    .then(user => {
                        if (user != null) {
                            return resolve({
                                result: false,
                                message: MessageConstants.UsernameExistingError
                            })
                        } else {
                            let user = new User({
                                username: username,
                                password: passwordHelper.hash(username, p.password),
                                email: p.email,
                                tel: p.tel,
                                address: p.address,
                                coin: 0,
                                background: '',
                                criterion: sp.criterion,
                                isActive: false,
                                lang: p.lang,
                                createdAt: new Date()
                            });

                            user.save().then(() => {
                                // informm to sp
                                resolve({
                                    success: true,
                                    message: MessageConstants.RegisterSuccessfully
                                });
                            }).catch(err => reject(err));
                        }
                    })
                    .catch(err => reject(err));
            });
        });
    }

    checkUsername(username) {
        return new Promise((resolve, reject) => {
            User.findOne({
                username: username
            })
                .then(user => {
                    if (user) {
                        resolve({ success: false, message: MessageConstants.UsernameExistingError })
                    } else {
                        resolve({ success: true })
                    }
                })
                .catch(err => reject(err));
        });
    }

    verify(username, code) {
        return new Promise((resolve, reject) => {
                User.findOne({
                username: username,
            })
                .then(user => {
                    if (user == null) {
                        resolve(MessageConstants.LinkNotExistingError)
                    } else {
                        if (!user.isActive) {
                            user.isActive = true;
                            user.save().then(() => {
                                resolve(MessageConstants.VerifyEmailSuccessfully);
                            }).catch(err => reject(err));
                        } else {
                            resolve(MessageConstants.EmailVerified);
                        }


                    }
                })
                .catch(err => reject(err));
        });
    }

    getAll() {
        return new Promise((resolve, reject) => User.find()
            .then(users => resolve(users))
            .catch(err => reject(err)));
    }

    getByUsername(username) {
        return new Promise((resolve, reject) => {
            User.findOne({
                username: username
            })
                .then(user => {
                    resolve(user)
                })
                .catch(err => reject(err));
        });
    }


    async getById(id) {
        try {
            let user = await User.findById(id);
            return user;
        } catch (error) {
        }
    }


    addOrUpdate(user) {
        return new Promise((resolve, reject) => {
            let query = {
                _id: user._id
            };
            let options = {
                upsert: true
            };
            User.findOneAndUpdate(query, user, options)
                .then(cus => resolve(cus))
                .catch(err => reject(err));
        });
    }

    updateBackground(userId, bgName) {
        return new Promise((resolve, reject) => {
            let query = {
                _id: userId
            };
            let options = {
                upsert: true
            };
            User.findOneAndUpdate(query, {
                background: bgName
            }, options)
                .then(cus => resolve(cus))
                .catch(err => reject(err));
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            User.findById(id)
                .then(user => resolve(user))
                .catch(err => reject(err));
        });
    }

    addDeviceToken(userId, data) {
        let deviceToken = data.deviceToken;
        return new Promise((resolve, reject) => {
            User.findById(userId)
                .then(user => {
                    if (user.deviceTokens) {
                        if (user.deviceTokens.indexOf(deviceToken) < 0) {
                            {
                                user.deviceTokens.push(deviceToken);
                                user.save().then(() => resolve({
                                    success: true, message: "Device token was added successfully"
                                }));
                            }
                        } else {
                            resolve({
                                success: true, message: "Device token already exists"
                            });
                        }
                    } else {
                        user.deviceTokens = [deviceToken];
                        user.save().then(() => resolve({
                            success: true, message: "Device token was added successfully"
                        }));
                    }
                })
                .catch(err => reject(err));
        });
    }

    updateInfo(userId, p) {
        return new Promise((resolve, reject) => {
            User.findById(userId)
                .then(user => {
                    if (p.email) user.email = p.email;
                    if (p.tel) user.tel = p.tel;
                    if (p.address) user.address = p.address;
                    if (p.background) user.background = p.background;
                    if (p.password) user.password = p.password;
                    user.save().then(() => resolve({
                        success: true
                    }));
                })
                .catch(err => reject(err));
        });
    }


    async  checkPassword(userId, password) {
        const user = await User.findById(userId).select('username password');
        const encryptPassword = passwordHelper.hash(user.username, password);
        if (encryptPassword == user.password) {
            return { success: true }
        } else {
            return { success: false }
        }
    }

    async  checkUserNameExist(usernameInput) {
        var user = await User.findOne({ username: usernameInput.toLowerCase() })
        if (user != null) {
            const randomNumber = this.randomStringNumberForResetPassword();
            user.resetPasswordCodes.push({ code: randomNumber, createdAt: new Date() })
            await user.save()
            if (user.email)
                this.sentMailResetPasswordToUser(user.email, user.name, user.username, randomNumber);
            return {
                success: true
            }
        } else {
            return { success: false }
        }
    }

    async  checkCodeResetPassword(userName, code) {
        var user = await User.findOne({ username: userName.toLowerCase() });
        if (user != null) {
            let resetPasswordCodes = user.resetPasswordCodes;
            const lastCode = resetPasswordCodes[resetPasswordCodes.length - 1];
            if (code == lastCode.code) {
                return {
                    success: true
                }
            }
        }
        return { success: false }
    }

    async updatePassword(userId, newPassword, oldPassword) {
        const check = await this.checkPassword(userId, oldPassword);
        if (check.success) {
            return new Promise((resolve, reject) => {
                User.findById(userId)
                    .then(user => {
                        const encryptPassword = passwordHelper.hash(user.username, newPassword);
                        if (encryptPassword) user.password = encryptPassword;
                        user.save().then(() => resolve({
                            success: true
                        }));
                    })
                    .catch(err => reject(err));
            });
        }
    }

    async resetPassword(userName, newPassword, code) {
        const check = await this.checkCodeResetPasswordValid(userName, code);
        if (check) {
            return new Promise((resolve, reject) => {
                User.findOne({ username: userName.toLowerCase() })
                    .then(user => {
                        const encryptPassword = passwordHelper.hash(user.username, newPassword);
                        if (encryptPassword) user.password = encryptPassword;
                        user.save().then(() => resolve({
                            success: true
                        }));
                    })
                    .catch(err => reject(err));
            });
        }
    }

    async checkCodeResetPasswordValid(userName, code) {
        var user = await User.findOne({ username: userName.toLowerCase() });
        if (user && user.resetPasswordCodes) {
            const resetPasswordCodes = user.resetPasswordCodes;
            const lastCode = resetPasswordCodes[resetPasswordCodes.length - 1];
            const offsetTime = 30 * 60 * 1000;
            const currentDate = new Date();
            const expired = currentDate.getTime() - lastCode.createdAt.getTime() < offsetTime ? true : false;
            if (resetPasswordCodes[resetPasswordCodes.length - 1].code == code && expired) return true;
        }
        return false;
    }

    randomInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low)
    }

    randomStringNumberForResetPassword() {
        let numbers = new Array(5)
        for (var i = 0; i < numbers.length; i++) {
            numbers[i] = this.randomInt(1, 10)
        }
        return numbers.join('');
    }

    sentMailResetPasswordToUser(email, userName, userUsename, numberReset) {
        mailHelper.sentEmailResetPasswordToUser(email, userName, userUsename, numberReset);
    }

}
module.exports = new UserService()