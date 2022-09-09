const express = require('express')
const router = express.Router()

const {userLogin} = require('../controller/authentication')
const {createUser, getUser, followUser, unfollowUser} = require('../controller/userController')
const {createPost, deletePost, likePost, unlikePost, commentPost, getPost, getPosts} = require('../controller/postController')
const {userAuthorization} = require('../middleware/authorization')

router.post('/register', createUser)
router.post('/authenticate', userLogin)

router.post('/follow/:id', userAuthorization, followUser)
router.post('/unfollow/:id', userAuthorization, unfollowUser)
router.get('/user', userAuthorization, getUser)

router.post('/posts', userAuthorization, createPost)
router.delete('/posts/:id', userAuthorization, deletePost)

router.post('/like/:id', userAuthorization, likePost)
router.post('/unlike/:id', userAuthorization, unlikePost)

router.post('/comment/:id', userAuthorization, commentPost)
router.get('/posts/:id', userAuthorization, getPost)
router.get('/all_posts', userAuthorization, getPosts)


module.exports = router