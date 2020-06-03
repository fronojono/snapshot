const express = require("express");
require('dotenv').config()

// connect to db
const connectDB = require('./db')
const checkLogin = require('./middleware')
connectDB()


const app = express();

app.use(express.json()) //middleware to accept json object from frontend

//app.use(checkLogin) // midleware to check if the user have the right to access to some resource



/*
 we can apply middleware for particular resource or endpoint .
*/





app.get('/protected', checkLogin, (req, res) => {
    res.json({ name: 'FRIOUI Meher' })
})

app.use(require('./controller/register'))
app.use(require('./controller/login'))

app.use(checkLogin)
app.use(require('./controller/post'))
app.use(require('./controller/user'))

app.listen(process.env.PORT, function () {
    console.log(`Listening on ${process.env.PORT}`);
});
