const express = require('express')

const router = express.Router()

// ------------------ MIDDLEWARES --------------------
const { auth } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/uploadFile')


// ------------------ LOGIN & REGISTER ROUTER --------------------
const { register } = require('../controllers/register')
const { login } = require('../controllers/login')

router.post('/register', register)
router.post('/login', login)

// ------------------ USER ROUTER --------------------
const { getUsers, getUser, editUser, deleteUser } = require('../controllers/user')

router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.patch('/user/:id', auth, uploadFile("image"),  editUser)
router.delete('/user/:id', deleteUser)

// ------------------ FOLLOW ROUTER --------------------
const { addFollow, unfollow, getFollowing, getFollower } = require('../controllers/follow')

router.post('/follow', addFollow)
router.delete('/unfollow/:id',auth, unfollow)
router.get('/following/:id', getFollowing)
router.get('/follower/:id', getFollower)

// ------------------ MESSAGE ROUTER --------------------

const { addMessage, getMessage } = require('../controllers/message')

router.post('/message/:id',auth, addMessage)
router.get('/messages/:id',auth, getMessage)


// ------------------ FEED ROUTER --------------------

const { postFeed, deletePost, followingFeeds } = require('../controllers/feed')

router.post('/feed',auth, uploadFile("fileName"), postFeed)
router.delete('/feed/:id',auth, deletePost)
router.get('/feed', auth, followingFeeds)















module.exports = router