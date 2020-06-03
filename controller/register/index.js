const express = require('express')
const bcrypt = require('bcrypt')
const app = express.Router()

const { UserModel } = require('../../model')
const checkField = (name, email, password) => {
    return !!name && !!email && !!password
}

const renderMessage = (res, code, message) => {
    return res.status(code).json({ message })
}

const checkPassword = (password) => {
    return password && password.length > 6
}

app.post('/register', (req, res) => {

    const { name, email, password } = req.body
    let check = checkField(name, email, password)
    const checkPass = checkPassword(password)
    if (checkPass === false) {
        return renderMessage(res, 421, 'password must be greater than 6 cacarcter !')
    }
    if (check) {
        bcrypt.hash(password, 12).then(hashedPassword => {
            UserModel.findOne({ email })
                .then((savedUser) => {
                    if (savedUser) {
                        return renderMessage(res, 421, 'user exist !')
                    } else {
                        const user = new UserModel({
                            email,
                            name,
                            password: hashedPassword
                        })
                        user.save()
                            .then((usr) => {
                                return renderMessage(res, 200, 'successfully registered')
                            })
                            .catch((err) => {
                                return renderMessage(res, 400, err)
                            })
                    }
                })

        })
    } else {
        return renderMessage(res, 422, 'please fill all the field !')

    }

})

module.exports = app
