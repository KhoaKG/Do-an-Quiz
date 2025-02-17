const express = require('express')
const router = express.Router()
const controller = require("../../controllers/client/user.controller")

const validate = require("../../validates/admin/user.validate")

const authMiddleware = require("../../middleware/client/auth.middleware")

router.get('/register', controller.register)

router.post('/register', validate.registerPost, controller.registerPost)

router.get('/login', controller.login)

router.post('/login', validate.loginPost, controller.loginPost)

router.get('/logout', controller.logout)

router.get('/password/forgot', controller.forgotPassword)

router.post('/password/forgot', controller.forgotPasswordPost)

router.get('/password/otp', controller.otpPassword)

router.post('/password/otp', controller.otpPasswordPost)

router.get('/password/reset', controller.resetPassword)

router.post('/password/reset', validate.resetPasswordPost, controller.resetPasswordPost)

router.get('/info', authMiddleware.requireAuth, controller.info)

router.get('/my-course', authMiddleware.requireAuth, controller.myCourse)

module.exports = router
