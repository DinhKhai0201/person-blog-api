const encryptionHelper = require('../helpers/encryption.helper'),
    dateTimeHelper = require('../helpers/date-time.helper'),
    passwordHelper = require('../helpers/password.helper'),
    appConfig = require('../configs/app.config'),
    User = require('mongoose').model('User'),
    userService = require('./user.service'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants;

class AuthService {
    generateUserAccessToken(userId, accessType) {
        let token = JSON.stringify({
            userId: userId,
            access: accessType,
            expiredTime: dateTimeHelper.addMinuteFromNow(appConfig.userToken.expiresIn)
        });

        return encryptionHelper.encrypt(token);
    }
    verifyAccessToken(accessToken) {
        if (!accessToken) return null;
        let token = encryptionHelper.decrypt(accessToken);
        if (!token) return null;
        var obj = JSON.parse(token);
        if (new Date(obj.expiredTime).getTime() < new Date().getTime()) return null;
        return token;
    }

    verifyAccessTokenV2(accessToken) {
        if (!accessToken)
            return {
                success: false,
                message: MessageConstants.TokenInvalid
            };
        let token = encryptionHelper.decrypt(accessToken);
        if (!token)
            return {
                success: false,
                message: MessageConstants.TokenInvalid
            };
        var obj = JSON.parse(token);
        if (new Date(obj.expiredTime).getTime() < new Date().getTime())
            return {
                success: false,
                message: MessageConstants.TokenExpired
            };
        return {
            success: true,
            data: obj
        };
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            let query = {
                email: email.toLowerCase(),
                password: passwordHelper.hash(email.toLowerCase(), password)
            };
            User.findOne(query)
                .exec((err, user) => {
                    if (user && user.isActive) {
                        let access = 'auth';
                        let token = this.generateUserAccessToken(user._id, access);
                        var p = {
                            role: user.role,
                            username: user.username,
                            email: user.email,
                            tel: user.tel,
                            address: user.address,
                            background: user.background,
                            coin:user.coin, 
                            accessToken: token,
                        };
                        let tokens = user.tokens;
                        tokens.push({
                            access,
                            token
                        })
                        user.tokens = tokens;
                        user.save().then(() => resolve(p));

                    } else {
                        resolve(false);
                    }
                }).catch(err => reject(err));
        });
    }

    logout(userId, tokenStr) {
        return new Promise((resolve, reject) => {
            User.findById(userId)
                .then(user => {
                    if (user && user.tokens && user.tokens.length > 0) {
                        user.tokens = user.tokens.filter(function (item) {
                            return item.token != tokenStr;
                        })
                        user.save().then(() => resolve({
                            success: true
                        }));
                    } else {
                        resolve({
                            success: false
                        });
                    }
                })
        })
    }

    generateUserActionAPIToken(customerId, userId, botName) {
        let token = JSON.stringify({
            customerId: customerId,
            userId: userId,
            botName: botName,
            expiredTime: dateTimeHelper.addMinuteFromNow(appConfig.accessToken.expiresIn)
        });
        return encryptionHelper.encrypt(token);
    }

    verifyUserAndCustomerFromToken(encryptedTokenStr) {
        return new Promise((resolve, reject) => {
            try {
                if (!encryptedTokenStr) {
                    return reject({
                        message: "The token is invalid.",
                        status: 400
                    });
                }

                let tokenStr = encryptionHelper.decrypt(encryptedTokenStr);
                if (!tokenStr || tokenStr == null) {
                    return reject({
                        message: "The token is invalid.",
                        status: 400
                    });
                }

                let tokenObject = JSON.parse(tokenStr);
                if (!tokenObject) {
                    return reject({
                        message: "The token is invalid.",
                        status: 400
                    });
                }

                var providerPromise = providerService.getById(tokenObject.userId);
                var customerPromise = customerService.getById(tokenObject.customerId);
                Promise.all([providerPromise, customerPromise])
                    .then(([provider, customer]) => {
                        if (provider && customer) {
                            resolve({
                                provider,
                                customer
                            });
                        } else {
                            reject({
                                message: "Provider or customer is not found.",
                                status: 400
                            });
                        }
                    })
            } catch (e) {
                let err = {
                    message: "Internal server error. Error: " + e,
                    status: 500
                }
                return reject(err);
            }
        });
    }
}
module.exports = new AuthService()
