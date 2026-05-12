const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()

const {
    getUsers,
    deleteUser,
    signup, 
    login
} = require('../controllers/userController')

router.get('/', auth, getUsers)
router.delete('/:id', deleteUser)
router.post('/signup', signup)
router.post('/login', login)

module.exports = router