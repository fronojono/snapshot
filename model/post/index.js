const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema.Types

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true

    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [{
        text: String,
        postedBy: { type: ObjectId, ref: 'User' }
    }]
})

module.exports = mongoose.model('Post', PostSchema)
