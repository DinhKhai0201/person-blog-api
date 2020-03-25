const mongoose = require("mongoose"),
    Joi = require('joi'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    tel: String,
    address: String,
    background: String,
    isActive: { type: Boolean, default: false },
    coin: { type: String, default: 0 },
    role: { type: String, default: 0 },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    lang: { type: String, default: 'vi' },
    deviceTokens: [{ type: String, default: [] }],
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
}, {
        usePushEach: true
    }, {
        collection: "users"
});
// const userValidation = (user) => {
//     const schema = Joi.object().keys({
//         username: Joi.string().required().min(6),
//         password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
//         address: Joi.string(),
//         background: Joi.string(),
//         tel: Joi.string().required().regex(/^[0-9]{9,11}$/),
//         email: Joi.string().email({ minDomainAtoms: 2 })

//     })
//     return Joi.validate(user, schema, { abortEarly: false });
// }
    
// const updateUserValidation = (user) => {
//     const schema = Joi.object().keys({
//         username: Joi.string().required().min(6),
//         password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/),
//         address: Joi.string(),
//         background: Joi.string(),
//         tel: Joi.string().regex(/^[0-9]{9,11}$/),
//         email: Joi.string().email({ minDomainAtoms: 2 })

//     })
//     return Joi.validate(user, schema, { abortEarly: false });
// }

mongoose.model("User", userSchema);

