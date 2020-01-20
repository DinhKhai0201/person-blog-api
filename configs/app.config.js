const routeConfig = require('../configs/route.config');

module.exports = {
    env: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },
    root: "http://localhost:3000",
    file: {
        models: 'models/*.js',
        controllers: 'controllers/*.js',
        services: 'services/*.js'
    },
    encryption: {
        password: 'vs34X?T7BDj7-PUhYCq5w%w',
        salt: 'B5#9p5WcEPcZSJeSzFm&7Cs'
    },
    routes: routeConfig,
    facebook: {
        appToken: 'EAATi2dECieUBANZAD2z8xLXRDnSjYgf2NTnvZCLzT0eIMBc2JzcTV99URSpQbTGRPbkgut8ZBrScvVExk8aWw1OaWsGWHT9AWt8m8JLN8zloVxsVWx7gPZAKTpm2tVRXfikPTDhkO6IR3FZCP1IAvf4s0NGpMRlE8vZAKHoZCZAhdwZDZD',
        appSPToken: 'EAASNT5hh2J8BALKh2TKzr0bRW40U77pUcqABizIKToZAE26mjq3L46i60OBkx3d0YbEMNVUL7ZCqvjMBC6MDE7JRmk7Nw9TMXSZBV8zQk5rrg8pNLW9obNNAxrZBr7RiGQDbvZB5ICONhFZAZAP0Gchv100ZAkaULnOFVG2yptZC8ZCQZDZD',
    },
    spBot: {
        botName: "spbot",
        appId: "6add3451-55fc-4d61-bd68-339ab6f29c15",
        appPassword: "wmoJRVV84*cfxsJRD012(-:",
    },
    botstatedb: {
        host: 'https://gnjprodstate.documents.azure.com:443/',
        masterKey: 'O3JyFNQjMiZ0SHf0EzPNLnSxM0ONgJ04dRcNZkGKiVxeZuOYVWxs4lon1GdAWKd5YUBCx4Pcb0gG3kF8NNLPwA',
        database: 'botdocdb',
        collection: 'botdata'
    },
    google: {
        mapsAPIKey: 'AIzaSyBN3V7T7MRzJQAJA0wr6KKhEEjBTkRkHaM'
    },
    messengerCode: {
        expiresIn: 15000 // minutes //Todo: 15000 minutes for testing, 15 minutes for production
    },
    foodToken: {
        expiresIn: 1440 // minutes = 1 day.
    },
    accessToken: {
        expiresIn: 1440 // minutes = 1 day
    },
    providerToken: {
        expiresIn: 43200 // minutes =  30 days
    },
    adminToken: {
        expiresIn: 1440 // minutes
    },
    botToken: {
        expiresIn: 1440 // minutes
    },
    session: {
        secret: 'B5#9p5WcEPcZSJeSzFm&7Cs',
        cookie: {
            maxAge: 60000
        },
        resave: true,
        saveUninitialized: true
    },
    fcmServer: {
        host: 'https://fcm.googleapis.com/fcm/send',
        authKey: 'key=AAAAt5U4HZY:APA91bH_nlOc6d_II_NVknmoSrY-H8-RuBkS55znU-s6gXa74_K53omKzjQkAXpX4M3bJT3EIRr3Op23N7vT4ZigIOa4qLb5CpIi8sMvD0eO9sIyjXZ_MA9X_2pL0VySpzdR_mcHxijs'
    },
    stage: 'prod',
    apiServer: {
        host: 'https://do-an-cnpm.herokuapp.com/'
    },
    staticServer: {
        host: 'https://s3-ap-southeast-1.amazonaws.com/doancnpm/public/image'
    },
    isProd: false,
    botName: 'spbot'
};