const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const getUsers = async (req, res) => {
    const users = await User.find()
    res.status(200).send(users)
}

const deleteUser = async (req, res) => {
    const id = req.params.id
    const user = await User.findByIdAndDelete(id)

    if(!user) {
        res.status(404).json({ message: "User not found"})
    }
    
    res.status(200).json({ message: "User deleted"})
}

const signup = async (req, res) => {
    let { name, password } = req.body
    if (!name || name.trim() === "" || !password || password.trim() === "") {
        res.status(400).json({ message: "All fields are required!"})
    }

    name = name.trim()
    password = password.trim()

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await User.findOne({ name })

    if(existingUser) {
        res.status(400).json({ message: "User already exists"})
    }

    const user = new User({
        name,
        password: hashedPassword
    })

    await user.save()

    res.status(201).json({ message: "User created"})

}

const login = async (req, res) => {
    const { name, password } = req.body
    const user = await User.findOne({ name })

    if(!user) {
        res.status(404).json({ message: "User not found!" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        res.status(400).json({ message: "Correct credentials are needed" })
    }

    const token = jwt.sign(
        { id: user._id, name: user.name},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    res.status(200).json({
        message: "Login successful",
        token: token
    })


}

module.exports = {getUsers, deleteUser, signup, login}
