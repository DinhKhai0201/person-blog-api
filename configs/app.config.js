const routeConfig = require('../configs/route.config');

module.exports = {
    env: {
        port: process.env.PORT || 4002,
        host: process.env.HOST || 'localhost'
    },
    root: "http://localhost:4002",
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
    userToken: {
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
    botName: 'spbot',
    facebook: {
        APP_SECRET: '2a944ab7f2a57e7f5cc96df47c209e3b',
        VALIDATION_TOKEN: '123123123',
        PAGE_ACCESS_TOKEN: 'EAAMfa7fNnRcBAIdq22JyJ5CeCowgISqx8lYT8jLqGmi0ZADb6AVu2f9ORnzlToZAWZBlwzuVGE86LtxQ51dzJDVtSfUBD5i3rfiJOh7W2zS2gAqeKv1epWqAaxxwafbLR9KEWEH7tdNUdDyA14Up0ZBj44kl4QLrc9RJkbpAgZCyryup6gDE2',
    },
    dialogflow: {
        type: "service_account",
        project_id: "onlineeatsbot-okuooi",
        private_key_id: "e910007a505647873064bbb3da00fbd3c176de0e",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAGx/uoTjszG6E\nHsibQ6ZvQRXJm8M1vMIRMPPX04obpgnLKckFjwY40+n0z+wpZTRAsAUHhF2TaTSC\ncJGJIm8JTqvVLgHz1Zl3C7+a4yLmAEd22KwJe1EQJDM4SkaSn0UxndDX/JevnmML\n9VVV5hgAHuG7p/fEOIiI9jJDA/PloQIFxQJ6RUUaI/fm3eu0wyDHK0Sc5/cAlZlN\nQbtz85JATRp9/iv3DObt7LEyN98kRXm8xFBRfuOsLqIBrDUs/U9ODkIFr85c5Jac\nFsHD28eImOXG+VGlB2fiem3ZxGVyNbCWREY3iveojVkznWTmAHATrR9VHUp9iXaW\n33DeFqnxAgMBAAECggEAG3HUmEgepI/ZKxVlxe6+gI7tEKoo04zFseSLNZaCWMxa\nAlUUI6/o7OXzetbYj5pmgmZTNZ12q+hgCNGRrSSG9e6wFErYGxB1NgFu7G8OLYs1\nKniubUVZkaOGUMClv+0ymrHH5A9xUTTgxBTWzeiLHbtLtv46YqVL9jsr95CBP9kG\ntIbivPY2hTe4tPZNh0WW4vuneaeQ9egqc4HTP5AbwiBEY0vQDmj632D4/jOkxKaw\nrvnPGg+5zKVBmAiNkA9/ywsZDmOSQdJ/ked15JwtQOh4apUUeToeJSfIhj6QLB7R\n6McIIkoqVhJsPtbjqoQyy4S4Sj7w8QxcjDTqsuQZ1QKBgQD4mQUFrCLNWiedMBjj\nqBOnUaAA74uX3KykIDJ6yJm7U9uQDjQ2lRdAyqjffQsURV9rGtWp83IPmhamQ0q/\nRmHAJ2e8uRCBAzN1k+YJ0u/jc1w/LMpC3CbY63XSUIuTLTEilD/z0jzLAPagZGd2\nZY4xNAvrXPvsUJUm6jANqho2hQKBgQDF03yMDmI+kLKC7flDM+lm3UXpWZilEbXN\n0Zk6oTX4oV/Q0HPTwlOr9y32Yf0kb7LCsPwC54hKOj6Vk+Z4yga9EIUQhvJrRc6X\n6Z0kvAvS4dx8TVoPGPlnC1zZqD1Qi6E2T7K/jStStzG13qmKvt9mztrP1CQ0082S\nPpzImctPfQKBgQC0wW5pZXQYpEjRfjtarMc9jZgtlf+F+Cp/W/nYVSuSjbLD19AX\nL+isb67CcYUwxBBRLD3XSO/ScFOvqJYc5ewFb6F6E4XwiIdOIq/MzNcoJqUYOlUG\nsFR+vRX6Sh5ycRWc8vZdLqyNXrH0hYzFBaqSFCnmhMGYXi9VEErIZLqSkQKBgQCr\nN7nqNmDNqcr3CyTcB0gRoZ3qs4MsC0IBG1G1ruXZhUI6ptA5DU4B3nPHdVP1fz+G\nxku379DD/dlA+LtW+/QNGwkwHrweIFMIpEdADgllwdplM0WpH4Jsrybzs2suFUu4\niA47P+GpO6koscinr0AH6Sz1B7U2i8K2ur5T2NhguQKBgGSOP23IrbMG7EvcVYnA\nsRnRY+Qj1ILvyRa3JjN7eEMTY3dXf5UrJor4ZB7bkaH8Wuz7APUaBI0XWsKojCs/\nykPgCDTNr6fTOFb20JhDfSfx0LZmLregrY21zayzArX+NyMvEIR95UNF7tGZOJ4Q\nRK7H56SpQHnlH2f0KInM74Ii\n-----END PRIVATE KEY-----\n",
        client_email: "chatbot@onlineeatsbot-okuooi.iam.gserviceaccount.com",
        client_id: "113963238738144342298",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_ur: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/chatbot%40onlineeatsbot-okuooi.iam.gserviceaccount.com"
    }
};