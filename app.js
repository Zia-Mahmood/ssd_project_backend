const dotenv = require('dotenv')
const express = require("express");
const session = require('express-session')
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session)
const cors = require('cors')
const bodyParser = require('body-parser')

const userRoutes = require('./routes/userRoutes')


const app = express();
const port = process.env.PORT || 6001
dotenv.config({ path: './config.env' });


mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
    .then(() => console.log("Connection to MongoDB successfull..."))
    .catch((err) => console.log("Unable to connect to MongoDB...", err));


const mongoDBstore = new MongoDBStore({
    uri: process.env.DATABASE_CONNECTION_STRING,
    collection: 'localSessions',
})

// MIDDLEWARES
app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// SESSIONS HANDLER
const MAX_AGE = 1000 * 60 * 30; // 30 minutes
app.use(
    session({
        secret: 'DUB_NATION',
        name: 'session-id',
        store: mongoDBstore,
        cookie: {
            maxAge: MAX_AGE,
            secure: false, // Only set to true in production
        },
        rolling: true, // Reset session maxAge on each request
        resave: false,
        saveUninitialized: false,
    })
);

app.use('/api', userRoutes)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

module.exports = app