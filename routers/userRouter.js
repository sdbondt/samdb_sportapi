const express = require('express')
const { getProfile, getUser, getUsers } = require('../controllers/userController')
const router = express.Router()

router.get('/profile', getProfile)
router.get('/:userId', getUser)
router.get('/', getUsers)

module.exports = router