const express = require("express")
const router = express.Router()
const {ensureAuthenticated, checkUserNotLogin} = require('../middleware/auth')
const userController = require('../controllers/userController')

router.get('/signup',checkUserNotLogin,userController.signup)
router.post('/signup',userController.createUser)
router.get('/login',checkUserNotLogin,userController.login)
router.post('/login',userController.doLogin)
router.get('/dashboard',ensureAuthenticated,userController.dashboard)
router.post('/make-shorturl',ensureAuthenticated,userController.makeShortUrl)
router.get('/visit-shorturl/:url',ensureAuthenticated,userController.visitShortUrl)
router.get('/logout',userController.logout)

module.exports = router