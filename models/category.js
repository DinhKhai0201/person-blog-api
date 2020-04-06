const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null},
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
}, {
        usePushEach: true
    }, {
        collection: "categories"
    });

mongoose.model("Category", categorySchema);

