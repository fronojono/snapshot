const mongoose = require('mongoose')



const connectDB = () => {

    return mongoose
        .connect(process.env.CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('connected to db'))
        .catch((err) => console.log('Error', err))


}

module.exports = connectDB
