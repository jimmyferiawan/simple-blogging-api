const authRouter = require("express").Router()
const UserModel = require('../models/UserModel')
const OtpModel = require('../models/otp')
const UserController = require('../controllers/UserController')
const UserService = require('../services/UserService')
const AuthValidationHelper = require('../helpers/authValidationHelper')
const authValidationHelper = new AuthValidationHelper()
const  { generateActivationLink } = require("../services/OtpService");

const SMTPHelper = {generateActivationLink: generateActivationLink}

const userService = new UserService(UserModel(), SMTPHelper)
const userController = new UserController(userService)

authRouter.post('/signup', userController.signUpUser(userService))
authRouter.post('/signin', userController.signInUser(userService))
authRouter.get('/u/profile/:username', userController.userDetail(userService, authValidationHelper))
authRouter.get('/u/:username', userController.viewUser(userService))
authRouter.put('/u/:username', userController.updateUserDetail(userService, authValidationHelper))
authRouter.get('/u/forget-password/check/:usernameOrEmailOrPhone', userController.verifyForgetPasswordData(userService))
authRouter.get('/u/forget-password/send/:usernameOrEmailOrPhone', userController.sendForgetPasswordToken(userService, OtpModel()))
authRouter.post('/u/forget-password/reset', userController.resetPassword(userService, OtpModel()))


module.exports=authRouter