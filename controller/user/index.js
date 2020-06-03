const express = require('express')

const app = express();
const { UserModel, PostModel } = require('../../model')
const checkLogin = require('../../middleware')


const renderMessage = (res, code, message) => {
    return res.status(code).json(message)
}

app.get('/user/:id', checkLogin, (req, res) => {
    UserModel
        .findOne({ _id: req.params.id })
        .select('-password')
        .then(user => {
            PostModel
                .find({ postedBy: req.params.id })
                .populate('postedBy', '_id name')
                .exec((err, post) => {
                    if (err) {
                        return renderMessage(res, 422, err)
                    }
                    return res.json({ user, post })
                })

        }).catch(err => {
            return renderMessage(res, 422, err)

        })
})

app.put('/follow', checkLogin, (req, res) => {
    UserModel
        .findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id },

        }, { new: true }, (err, result) => {
            if (err) {
                return renderMessage(res, 422, err)
            }
            UserModel
                .findByIdAndUpdate(req.user._id, {
                    $push: { following: req.body.followId },

                }, { new: true }).then(result => {
                    res.json({ result })
                }).catch(err => {
                    return renderMessage(res, 422, err)

                })
        })
})


app.put('/unfollow', checkLogin, (req, res) => {
    UserModel
        .findByIdAndUpdate(req.body.unfollowId, {
            $pull: { followers: req.user._id },

        }, { new: true }, (err, result) => {
            if (err) {
                return renderMessage(res, 422, err)
            }
            UserModel
                .findByIdAndUpdate(req.user._id, {
                    $pull: { following: req.body.unfollowId },

                }, { new: true }).then(result => {
                    res.json({ result })
                }).catch(err => {
                    return renderMessage(res, 422, err)

                })
        })
})


module.exports = app
