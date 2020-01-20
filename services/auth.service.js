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

    generateBookAccessToken(bookId, customerId, userId, botName) {
        let token = JSON.stringify({
            bookId: bookId,
            customerId: customerId,
            userId: userId,
            botName: botName,
            expiredTime: dateTimeHelper.addMinuteFromNow(appConfig.accessToken.expiresIn)
        });
        return encryptionHelper.encrypt(token);
    }

    generateShipAccessToken(userId, customerId, shipId, botName) {
        let token = JSON.stringify({
            customerId: customerId,
            userId: userId,
            botName: botName,
            shipId: shipId,
            expiredTime: dateTimeHelper.addMinuteFromNow(appConfig.accessToken.expiresIn)
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

    login(username, password) {
        return new Promise((resolve, reject) => {
            let query = {
                username: username.toLowerCase(),
                password: passwordHelper.hash(username.toLowerCase(), password)
            };
            User.findOne(query)
                .exec((err, user) => {
                    if (user && user.isActive) {
                        let access = 'auth';
                        let token = this.generateUserAccessToken(user._id, access);
                        var p = {
                            username: user.username,
                            name: user.name,
                            email: user.email,
                            tel: user.tel,
                            address: user.address,
                            background: user.background,
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

    verifyShipToken(encryptedTokenStr) {
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
                } else if (new Date(tokenObject.expiredTime).getTime() < new Date().getTime()) {
                    return reject({
                        message: "The token is expired.",
                        status: 400
                    });
                } else {
                    var getProviderPromise = userService.getUserWithMenuById(tokenObject.userId);
                    var getCustomerPromise = customerService.getById(tokenObject.customerId);
                    Promise.all([getProviderPromise, getCustomerPromise])
                        .then(([rs, customer]) => {
                            if (!rs.provider) {
                                return reject({
                                    message: "The provider is not found.",
                                    status: 400
                                });
                            }
                            if (!customer) {
                                let err = {
                                    message: "The customer is not found.",
                                    status: 400
                                }
                                return reject(err);
                            }
                            if (tokenObject.shipId !== undefined) {
                                shipService.getById(tokenObject.shipId)
                                    .then(ship => {
                                        // ship.botName = tokenObject.botName;
                                        return resolve({
                                            provider: rs.provider,
                                            menus: rs.menus,
                                            customer: customer,
                                            ship: ship
                                        });
                                    }).catch(err => console.log(err));
                            } else {
                                shipService.create(rs.provider, customer).then(ship => {
                                    // ship.botName = tokenObject.botName;
                                    return resolve({
                                        provider: rs.provider,
                                        customer: customer,
                                        menus: rs.menus,
                                        ship: ship
                                    });
                                });
                            }
                        });
                }
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
