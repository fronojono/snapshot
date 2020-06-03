const express = require('express')

const app = express();
const { PostModel } = require('../../model')
const checkLogin = require('../../middleware')

const checkField = (title, body, photo) => {
    return !!title && !!body && !!photo
}
const renderMessage = (res, code, message) => {
    return res.status(code).json(message)
}
var obj = {}
app.post("/post", checkLogin, (req, res) => {
    const { title, body, photo } = req.body
    const check = checkField(title, body, photo)
    if (check) {
        const { user } = req
        const post = new PostModel({
            title,
            body,
            postedBy: user,
            photo
        })
        post.save()
            .then((result) => {
                if (result) {
                    obj.user = {
                        id: result.postedBy._id,
                        name: result.postedBy.name,
                        email: result.postedBy.email,
                    }
                    obj.id = result._id
                    obj.title = result.title
                    obj.body = result.body
                    obj.photo = result.photo
                    return renderMessage(res, 200, obj)
                }
            })
            .catch((err) => {
                return renderMessage(res, 422, err)
            })
    } else {
        return renderMessage(res, 422, 'please fill all the field !')
    }

});


app.get('/posts', checkLogin, (req, res) => {
    PostModel.find()
        .populate('postedBy', '_id email name')
        .populate('comments.postedBy', '_id name')

        .then((resultat) => {

            return renderMessage(res, 200, resultat)

        })
        .catch((error) => {
            return renderMessage(res, 422, error)

        })
})

app.get('/mypost', checkLogin, (req, res) => {
    const { user: { _id } } = req
    PostModel
        .find({ postedBy: _id })
        .populate("postedBy", '_id email name')
        .then((resultat) => {
            return renderMessage(res, 200, resultat)

        })
        .catch((error) => {
            return renderMessage(res, 422, error)

        })
})

app.put('/like', checkLogin, (req, res) => {
    const { postId } = req.body
    const { user: { _id } } = req

    PostModel.findByIdAndUpdate(postId, {
        $push: { likes: _id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return renderMessage(res, 422, { error: err })

        }
        return renderMessage(res, 200, result)

    })

})

app.put('/unlike', checkLogin, (req, res) => {
    const { postId } = req.body
    const { user: { _id } } = req
    PostModel.findByIdAndUpdate(postId, {
        $pull: { likes: _id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return renderMessage(res, 422, { error: err })

        }
        return renderMessage(res, 200, result)

    })

})


app.put('/comment', checkLogin, (req, res) => {
    const { postId, text } = req.body
    const { user: { _id } } = req
    const comment = {
        text,
        postedBy: _id
    }
    PostModel.findByIdAndUpdate(postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return renderMessage(res, 422, { error: err })

            }
            return renderMessage(res, 200, result)

        })

})


app.delete('/post/:postId', checkLogin, (req, res) => {
    PostModel
        .findOne({ _id: req.params.postId })
        .populate('postedBy', '_id')
        .exec((err, post) => {
            console.log('post', post)
            if (err || !post) {
                return renderMessage(res, 422, { error: err })

            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                const postedID = req.params.postId
                PostModel
                    .remove({ _id: req.params.postId })
                    .then(result => {
                        res.json({ ...result, postedID })

                    })
                    .catch((err) => {
                        return renderMessage(res, 422, { error: err })

                    })
            }
        })
})

module.exports = app
