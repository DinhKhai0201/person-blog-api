const mongoose = require('mongoose');
const passwordHelper = require('../helpers/password.helper');
const Provider = mongoose.model('Provider');
const constants = require('../common/constants');
const MessageConstants = constants.MessageConstants;
const Menu = mongoose.model('Menu');
const fs = require('fs');
let configs = [];

class ProviderService {
    register(host, p) {
        return new Promise((resolve, reject) => {
            fs.readFile('temp/default_sp.json', 'utf8', function (err, data) {
                if (err) throw err;
                let sp = JSON.parse(data);
                var username = p.username.toLowerCase();
                Provider.findOne({
                    username: username
                })
                    .then(provider => {
                        if (provider != null) {
                            return resolve({
                                result: false,
                                message: MessageConstants.UsernameExistingError
                            })
                        } else {
                            let provider = new Provider({
                                name: p.name,
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

                            provider.save().then(() => {
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
            Provider.findOne({
                username: username
            })
                .then(provider => {
                    if (provider) {
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
            Provider.findOne({
                username: username,
            })
                .then(provider => {
                    if (provider == null) {
                        resolve(MessageConstants.LinkNotExistingError)
                    } else {
                        if (!provider.isActive) {
                            provider.isActive = true;
                            provider.save().then(() => {
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
        return new Promise((resolve, reject) => Provider.find()
            .then(providers => resolve(providers))
            .catch(err => reject(err)));
    }

    getByUsername(username) {
        return new Promise((resolve, reject) => {
            Provider.findOne({
                username: username
            })
                .then(provider => {
                    resolve(provider)
                })
                .catch(err => reject(err));
        });
    }

    getByFanpageId(fanpageId) {
        return new Promise((resolve, reject) => {
            Provider.findOne({
                fanpageId: fanpageId
            })
                .then(provider => {
                    resolve(provider)
                })
                .catch(err => reject(err));
        });
    }

    async getById(id) {
        try {
            let provider = await Provider.findById(id);
            return provider;
        } catch (error) {
        }
    }


    addOrUpdate(provider) {
        return new Promise((resolve, reject) => {
            let query = {
                _id: provider._id
            };
            let options = {
                upsert: true
            };
            Provider.findOneAndUpdate(query, provider, options)
                .then(cus => resolve(cus))
                .catch(err => reject(err));
        });
    }

    updateBackground(providerId, bgName) {
        return new Promise((resolve, reject) => {
            let query = {
                _id: providerId
            };
            let options = {
                upsert: true
            };
            Provider.findOneAndUpdate(query, {
                background: bgName
            }, options)
                .then(cus => resolve(cus))
                .catch(err => reject(err));
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            Provider.findById(id)
                .then(provider => resolve(provider))
                .catch(err => reject(err));
        });
    }

    addDeviceToken(providerId, data) {
        let deviceToken = data.deviceToken;
        return new Promise((resolve, reject) => {
            Provider.findById(providerId)
                .then(provider => {
                    if (provider.deviceTokens) {
                        if (provider.deviceTokens.indexOf(deviceToken) < 0) {
                            {
                                provider.deviceTokens.push(deviceToken);
                                provider.save().then(() => resolve({
                                    success: true, message: "Device token was added successfully"
                                }));
                            }
                        } else {
                            resolve({
                                success: true, message: "Device token already exists"
                            });
                        }
                    } else {
                        provider.deviceTokens = [deviceToken];
                        provider.save().then(() => resolve({
                            success: true, message: "Device token was added successfully"
                        }));
                    }
                })
                .catch(err => reject(err));
        });
    }

    updateInfo(providerId, p) {
        return new Promise((resolve, reject) => {
            Provider.findById(providerId)
                .then(provider => {
                    if (p.name) provider.name = p.name;
                    if (p.email) provider.email = p.email;
                    if (p.tel) provider.tel = p.tel;
                    if (p.address) provider.address = p.address;
                    if (p.background) provider.background = p.background;
                    if (p.password) provider.password = p.password;
                    provider.save().then(() => resolve({
                        success: true
                    }));
                })
                .catch(err => reject(err));
        });
    }


    async  checkPassword(providerId, password) {
        const provider = await Provider.findById(providerId).select('username password');
        const encryptPassword = passwordHelper.hash(provider.username, password);
        if (encryptPassword == provider.password) {
            return { success: true }
        } else {
            return { success: false }
        }
    }

    async  checkUserNameExist(usernameInput) {
        var provider = await Provider.findOne({ username: usernameInput.toLowerCase() })
        if (provider != null) {
            const randomNumber = this.randomStringNumberForResetPassword();
            provider.resetPasswordCodes.push({ code: randomNumber, createdAt: new Date() })
            await provider.save()
            if (provider.email)
                this.sentMailResetPasswordToProvider(provider.email, provider.name, provider.username, randomNumber);
            return {
                success: true
            }
        } else {
            return { success: false }
        }
    }

    async  checkCodeResetPassword(userName, code) {
        var provider = await Provider.findOne({ username: userName.toLowerCase() });
        if (provider != null) {
            let resetPasswordCodes = provider.resetPasswordCodes;
            const lastCode = resetPasswordCodes[resetPasswordCodes.length - 1];
            if (code == lastCode.code) {
                return {
                    success: true
                }
            }
        }
        return { success: false }
    }

    async updatePassword(providerId, newPassword, oldPassword) {
        const check = await this.checkPassword(providerId, oldPassword);
        if (check.success) {
            return new Promise((resolve, reject) => {
                Provider.findById(providerId)
                    .then(provider => {
                        const encryptPassword = passwordHelper.hash(provider.username, newPassword);
                        if (encryptPassword) provider.password = encryptPassword;
                        provider.save().then(() => resolve({
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
                Provider.findOne({ username: userName.toLowerCase() })
                    .then(provider => {
                        const encryptPassword = passwordHelper.hash(provider.username, newPassword);
                        if (encryptPassword) provider.password = encryptPassword;
                        provider.save().then(() => resolve({
                            success: true
                        }));
                    })
                    .catch(err => reject(err));
            });
        }
    }

    async checkCodeResetPasswordValid(userName, code) {
        var provider = await Provider.findOne({ username: userName.toLowerCase() });
        if (provider && provider.resetPasswordCodes) {
            const resetPasswordCodes = provider.resetPasswordCodes;
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

    sentMailResetPasswordToProvider(email, providerName, providerUsename, numberReset) {
        mailHelper.sentEmailResetPasswordToProvider(email, providerName, providerUsename, numberReset);
    }

    getProviderWithMenuById(id) {
        return new Promise((resolve, reject) => {
            const menuPromise = Menu.find({ provider: id, isDeleted: false })
                .sort({ name: 1 })
            const providerPromise = Provider.findById(id)

            Promise.all([menuPromise, providerPromise])
                .then(([rs, provider]) => {
                    resolve({ provider, menus: rs })
                });
        });
    }
}
module.exports = new ProviderService()