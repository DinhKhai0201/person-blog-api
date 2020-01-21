const mongoose = require("mongoose"),
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
    deviceTokens: [{ type: String, default: [] }],
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
}, {
        usePushEach: true
    }, {
        collection: "users"
    });

mongoose.model("User", userSchema);

