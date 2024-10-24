const { isNull } = require('util');
const Users = require('../models/user')
const bcrypt = require('bcryptjs')

const addUser = async (req, res) => {
    const { name,role,email, passwordHash, createdAt } = req.body;
    console.log(req.body);

    if (!name || !passwordHash || !role) {
        return res.status(400).json({ msg: 'Missing details' })
    }

    const user = await Users.findOne({ name })
    if (user) {
        return res.status(400).json({ msg: 'User already exist' })
    }

    const newUser = new Users({ name,role,email, passwordHash, createdAt, })
    // hasing the password
    bcrypt.hash(password, 7, async (err, hash) => {
        if (err)
            return res.status(400).json({ msg: 'error while saving the password' })

        newUser.password = hash
        const savedUserRes = await newUser.save()

        if (savedUserRes)
            return res.status(200).json({ msg: 'User is successfully saved' })
    })
}

const login = async (req, res) => {
    console.log(req.body);
    const { username, password, lastLogin } = req.body

    if (!username || !password || !lastLogin) {
        res.status(400).json({ msg: 'Something missing' })
    }

    const user = await Users.findOne({ name: username }) // finding user in db
    if (!user) {
        return res.status(400).json({ msg: 'User not found' })
    }
    console.log(user);
    // comparing the password with the saved hash-password
    const matchPassword = await bcrypt.compare(password, user.password)
    console.log(matchPassword);
    if (matchPassword) {
        const userSession = { name: user.username } // creating user session to keep user loggedin also on refresh
        req.session.user = userSession // attach user session to session object from express-session
        req.session.save();
        return res
            .status(200)
            .json({ msg: 'You have logged in successfully', userSession }) // attach user session id to the response. It will be transfer in the cookies
    } else {
        return res.status(400).json({ msg: 'Invalid credential' })
    }
}

const logout = async (req, res) => {
    console.log("present");
    if (req.session.user) {

        req.session.destroy(err => {
            if (err)
                return res.status(500).send("Unable to Logout!");
            else {
                console.log("user logged out");
                return res.status(200).json({ "msg": "Logout Successfull..." });
            }
        })
    }
}

const isAuth = async (req, res) => {
    if (req.session.user) {
        return res.json(req.session.user)
    } else {
        return res.status(401).json('unauthorize')
    }
}

module.exports = {
    addUser,
    login,
    logout,
    isAuth
};