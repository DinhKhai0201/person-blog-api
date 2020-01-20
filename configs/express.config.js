const express = require('express'),
    compression = require('compression'),
    expressWs = require('express-ws')(express()),
    expressLayouts = require('express-ejs-layouts'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    busboy = require('connect-busboy'),
    cors = require('cors'),
    appConfig = require('./app.config');

module.exports.initViewEngine = (app) => {
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(expressLayouts);
}


module.exports.initStatic = (app) => {
    app.use(logger('dev'));
    app.use(bodyParser.json({ limit: 5120000, type: 'application/json' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(busboy());
    // app.use(bodyParser.json())
    app.use("/public", express.static(path.join(__dirname, '../public')));
}

module.exports.initRoutes = (app) => {
    app.use(cors({ origin: true, credentials: true }));
    appConfig.routes.forEach((route) => {
        app.use(route.path, require(path.resolve(route.router)));
    })
}

module.exports.initHandleException = (app) => {
    app.use(function (err, req, res, next) {
        console.error(err);
        if (err.type != undefined && err.type == 'json') {
            res.status(err.status || 500).send(err);
        } else {
            console.log(err.message); // For debugging in future.
            res.locals.message = err.message;
            res.status(err.status || 500);
            res.render('error', {
                layout: 'layout-error'
            });
        }
    });
}

module.exports.init = () => {
    return new Promise((resolve) => {
        let app = expressWs.app;
        app.use(compression());
        this.initViewEngine(app);
        this.initStatic(app);
        this.initRoutes(app);
        this.initHandleException(app);
        resolve(app);

    }).catch(err => console.log(err));
}

module.exports.expressWs = expressWs;

