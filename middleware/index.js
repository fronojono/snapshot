
const jwt = require('jsonwebtoken')

const { UserModel } = require('../model')



const renderMessage = (res, code, message) => {
    return res.status(code).json({ message })
}


const checkLogin = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return renderMessage(res, 401, 'user must be sign in !')
    }
    const token = authorization.replace("Bearer ", "")

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            return next(err);
        } else {
            const { _id } = decoded
            // if everything is good, save to request for use in other routes !
            UserModel.findById(_id)
                .then((userFounded) => {
                    req.user = userFounded;
                    next();
                })

        }
    });


}
module.exports = checkLogin
