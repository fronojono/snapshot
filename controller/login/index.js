const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express.Router()

const { UserModel } = require('../../model')


const renderMessage = (res, code, message) => {
    return res.status(code).json({ message })
}


app.post('/login', (req, res) => {
    const { email, password } = req.body
    console.log('Email', email)
    UserModel.findOne({ email })
        .then((userFound) => {
            if (userFound) {
                bcrypt.compare(password, userFound.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            const token = jwt.sign({ _id: userFound._id }, process.env.JWT_SECRET)
                            const { _id, name, email } = userFound
                            const obj = { token, user: { _id, name, email } }
                            return renderMessage(res, 200, obj)
                        } else {
                            return renderMessage(res, 500, 'check password again !')

                        }
                    })
            } else {
                return renderMessage(res, 500, 'user not found !')

            }
        })


})

module.exports = app
