const express = require("express")
const router = express.Router()
const {protect} = require('../middleware/appAuth')
const apiController = require('../controllers/apiController')


router.post('/signup',apiController.signup)
router.post('/login',apiController.login)

// router.get('/dashboard',protect,userController.dashboard)
router.post('/make-shorturl',protect,apiController.makeShortUrl)
router.get('/visit-shorturl/:url',apiController.visitShortUrl)
router.get('/logout',apiController.logout)

module.exports = router