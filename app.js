const dotenv = require('dotenv')
const express = require("express");
const session = require('express-session')
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session)



const app = express();
const port = process.env.PORT || 5001
dotenv.config({ path: './config.env' });


mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connection to MongoDB successfull...")).catch((err) => console.log("Unable to connect to MongoDB...", err));


const mongoDBstore = new MongoDBStore({
    uri: process.env.DATABASE_CONNECTION_STRING,
    collection: 'localSessions',
})

// SESSIONS HANDLER
const MAX_AGE = 1000 * 60 * 60 * 3 // 3hrs
app.use(
    session({
        secret: 'DUB_NATION',
        name: 'session-id', // cookies name to be put in "key" field in postman
        store: mongoDBstore,
        cookie: {
            maxAge: MAX_AGE, // this is when our cookies will expired and the session will not be valid anymore (user will be log out)
            secure: false, // to turn on just in production
        },
        resave: false,
        saveUninitialized: false,
    })
)


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

module.exports = app