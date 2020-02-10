const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User'},
    tag: String,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null},
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    view: { type: String, default: 0 },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
}, {
        usePushEach: true
    }, {
        collection: "posts"
    });

mongoose.model("Post", postSchema);

