const authService = require('../services/auth.service'),
    providerService = require('../services/provider.service'),
    constants = require('../common/constants'),
    MessageConstants = constants.MessageConstants,
    enums = require('../common/enums'),
    RoleType = enums.RoleType;


class AuthController {

    authorizeBook(req, res, next) {
        let err = {
            message: MessageConstants.AccessDenied,
            status: 403
        };
        if (!req.query.token) {
            next(err);
        } else {
            authService.verifyProviderAndCustomerFromToken(req.query.token).then(result => {
                if (!result) {
                    return next(err);
                }

                req.body.provider = result.provider;
                req.body.customer = result.customer;
                return next();
            }).catch(err => next(err));
        }
    }

    authorizeShip(req, res, next) {
        let err = {
            message: MessageConstants.AccessDenied,
            status: 403
        };
        if (!req.query.token) {
            next(err);
        } else {
            authService.verifyShipToken(req.query.token).then(result => {
                if (!result) {
                    return next(err);
                }

                req.body.provider = result.provider;
                req.body.customer = result.customer;
                req.body.ship = result.ship;
                return next();
            }).catch(err => next(err));
        }
    }

    loginProvider(req, res, next) {
        authService.loginProvider(req.body.username, req.body.password).then(provider => {
            res.json(provider);
        }).catch(err => next(err));
    }

    logout(req, res, next) {
        let tokenStr = req.headers.authorization;
        authService.logout(req.body.id, tokenStr).then(rs => {
            res.json(rs);
        }).catch(err => next(err));
    }

    register(req, res, next) {
        providerService.register(req.headers.host, req.body).then(rs => {
            res.json(rs);
        }).catch(err => next(err));
    }

    checkUsername(req, res, next) {
        providerService.checkUsername(req.query.username).then(rs => {
            res.json(rs);
        }).catch(err => next(err));
    }

    verify(req, res, next) {
        providerService.verify(req.query.username, req.query.code).then(rs => {
            res.json(rs);
        }).catch(err => next(err));
    }

    verifyToken(req, res, next) {
        // Service Provider App Authorization
        let tkStr = req.headers.authorization;
        let data = authService.verifyAccessTokenV2(tkStr);
        if (!data.success) {
            res.json(data);
        } else {
            var token = data.data
            if (token.providerId) {
                providerService.getById(token.providerId).then(provider => {
                    if (provider && provider.tokens) {
                        if (provider.tokens[provider.tokens.length - 1].token != tkStr) {
                            let err = {
                                success: false,
                                message: "This account is being accessed by others, please re-login."
                            }
                            res.json(err);
                        } else {
                            data = Object.assign({}, data, {
                                name: provider.name,
                                email: provider.email,
                                tel: provider.tel,
                                address: provider.address,
                                background: provider.background,
                            })

                            res.json(data);
                        }
                    } else {
                        let err = {
                            success: false,
                            message: "Current user is invalid, please re-login.",
                        }
                        res.json(err);
                    }
                }).catch(err => next(err));
            }
        }
    }

    authorizeServiceProvider(req, res, next) {
        if (req.url.startsWith('/register')) return next();
        if (req.url.startsWith('/verify')) return next();
        if (req.url.startsWith('/localization')) return next();
        if (req.url.startsWith('/password/reset')) return next();

        // Service Provider App Authorization
        let tokenStr = req.headers.authorization;
        let decryptedToken = authService.verifyAccessTokenV2(tokenStr);
        if (!decryptedToken.data || (!decryptedToken.success && !req.url.startsWith('/logout'))) {
            let err = {
                // 
                status: 403,
                success: false,
                message: decryptedToken.message,
                type: 'json'
            };
            next(err);
        } else {
            let token = decryptedToken.data;
            req.body.id = token.providerId;
            next();
        }
    }

    authorizeManager(req, res, next) {
        // Administrator App Authorization
        let tokenStr = req.headers.authorization;
        let decryptedToken = authService.verifyAccessTokenV2(tokenStr);
        if (!decryptedToken.success) {
            console.error("Token is invalid.");
            let err = {
                // 
                status: 403,
                success: false,
                message: decryptedToken.message,
                type: 'json'
            };
            next(err);
        } else {
            let token = decryptedToken.data

            if (token.type == RoleType.Admin) {
                req.body.managerId = token.managerId;
                req.body.role = token.type;
                next();
            } else {
                console.error("Contributor cannot access these features");
                let err = {
                    // 
                    status: 403,
                    success: false,
                    message: decryptedToken.message,
                    type: 'json'
                };
                next(err);
            }
        }
    }

    authorizeContributor(req, res, next) {
        // Administrator App Authorization
        let tokenStr = req.headers.authorization;
        let decryptedToken = authService.verifyAccessTokenV2(tokenStr);
        if (!decryptedToken.success) {
            console.error("Token is invalid.");
            let err = {
                // 
                status: 403,
                success: false,
                message: decryptedToken.message,
                type: 'json'
            };
            next(err);
        } else {
            let token = decryptedToken.data;
            req.body.managerId = token.managerId;
            req.body.role = token.type;
            next();
        }
    }

    authorizeWebsocketSP(req, res, next) {
        // Service Provider App Authorization
        let tokenStr = req.query.token;
        let decryptedToken = authService.verifyAccessTokenV2(tokenStr);
        if (!decryptedToken.success) {
            console.error("Token is invalid.");
            let err = {
                // 
                status: 403,
                success: false,
                message: decryptedToken.message,
                type: 'json'
            };
            next(err);
        } else {
            let token = decryptedToken.data
            req.body.providerId = token.providerId;
            next();
        }
    }

    authorizeBotAPI(req, res, next) {
        let tkStr = req.headers.authorization;
        let data = authService.verifyAccessTokenV2(tkStr);
        if (!data.success) {
            res.json(data);
        } else {
            var token = data.data;
            if (token.username) {
                // Keep the old mechanism of calls from BOT
                providerService.getByUsername(token.username).then(provider => {
                    if (provider) {
                        if (provider.token != tkStr) {
                            let err = {
                                success: false,
                                message: "This account is being accessed by others, please re-login."
                            }
                            res.json(err);
                        } else {
                            req.body.username = token.username;
                            req.body.id = provider._id;
                            next();
                        }
                    } else {
                        let err = {
                            success: false,
                            message: "Current user is invalid, please re-login.",
                        }
                        res.json(err);
                    }
                }).catch(err => next(err));
            } else {
                // Adapt the new mechanism that uses id for higher performance
                if (token.providerId) {
                    providerService.getById(token.providerId).then(provider => {
                        if (provider && provider.tokens) {
                            if (provider.tokens[provider.tokens.length - 1].token != tkStr) {
                                let err = {
                                    success: false,
                                    message: "This account is being accessed by others, please re-login."
                                }
                                res.json(err);
                            } else {
                                req.body.id = provider._id;
                                next();
                            }
                        } else {
                            let err = {
                                success: false,
                                message: "Current user is invalid, please re-login.",
                            }
                            res.json(err);
                        }
                    }).catch(err => next(err));
                }
            }
        }
    }

    authorizeMenu(req, res, next) {
        let err = {
            message: MessageConstants.AccessDenied,
            status: 403
        };
        if (!req.query.token) {
            next(err);
        } else {
            authService.verifyProviderAndCustomerFromToken(req.query.token).then(result => {
                if (!result) {
                    return next(err);
                }

                req.body.provider = result.provider;
                req.body.customer = result.customer;
                return next();
            }).catch(err => next(err));
        }
    }
}
module.exports = new AuthController()