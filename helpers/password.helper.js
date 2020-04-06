const hashHelper = require('./hash.helper');

module.exports.hash = (email, password) => {
    return hashHelper.sha512(`${email}.${password}`);
}