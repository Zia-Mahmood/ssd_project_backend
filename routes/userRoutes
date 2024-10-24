const express = require('express');
const { addUser, login, logout,isAuth } = require('../controllers/userController');
const router = express.Router();

// Middleware to refresh session expiry on each request
router.use((req, res, next) => {
    if (req.session.user) {
        req.session.touch(); // Reset session expiration time
    }
    next();
});

router.post('/addUser', addUser);
router.post('/login', login);
router.get('/logout', logout);
router.get('/isAuth',isAuth);

module.exports = router;


// const Users = require('../models/user')
// const bcrypt = require('bcryptjs')
// const express = require('express')
//const router = express.Router()



// router.post('/register', async (req, res) => {
//     const { username, password } = req.body;
//     console.log(req.body);

//     if (!username || !password) {
//         return res.status(400).json({ msg: 'Missing details' })
//     }

//     const user = await Users.findOne({ username })
//     if (user) {
//         return res.status(400).json({ msg: 'User already exist' })
//     }

//     const newUser = new Users({ username, password })
//     // hasing the password
//     bcrypt.hash(password, 7, async (err, hash) => {
//         if (err)
//             return res.status(400).json({ msg: 'error while saving the password' })

//         newUser.password = hash
//         const savedUserRes = await newUser.save()

//         if (savedUserRes)
//             return res.status(200).json({ msg: 'User is successfully saved' })
//     })
// })


// router.post('/login', async (req, res) => {
//     console.log(req.body);
//     const { username, password } = req.body

//     if (!username || !password) {
//         res.status(400).json({ msg: 'Something missing' })
//     }

//     const user = await Users.findOne({ username: username }) // finding user in db
//     if (!user) {
//         return res.status(400).json({ msg: 'User not found' })
//     }
//     console.log(user);
//     // comparing the password with the saved hash-password
//     const matchPassword = await bcrypt.compare(password, user.password)
//     console.log(matchPassword);
//     if (matchPassword) {
//         const userSession = { username: user.username } // creating user session to keep user loggedin also on refresh
//         req.session.user = userSession // attach user session to session object from express-session
//         req.session.save();
//         return res
//             .status(200)
//             .json({ msg: 'You have logged in successfully', userSession }) // attach user session id to the response. It will be transfer in the cookies
//     } else {
//         return res.status(400).json({ msg: 'Invalid credential' })
//     }
// })

// router.get('/logout', async (req, res) => {
//     console.log("present");
//     if (req.session.user) {

//         req.session.destroy(err => {
//             if (err)
//                 return res.status(500).send("Unable to Logout!");
//             else {
//                 console.log("user logged out");
//                 return res.status(200).json({ "msg": "Logout Successfull..." });
//             }
//         })
//     }
// })


// router.get('/isAuth', async (req, res) => {
//     if (req.session.user) {
//         return res.json(req.session.user)
//     } else {
//         return res.status(401).json('unauthorize')
//     }
// })


//module.exports = router
