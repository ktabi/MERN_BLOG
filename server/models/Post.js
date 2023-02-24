const mongoose = require('mongoose');
const schema = mongoose;

const PostSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'}

}, {
    timestamps: true,
})

const postModel = mongoose.model("Post", PostSchema);

module.exports = postModel;
