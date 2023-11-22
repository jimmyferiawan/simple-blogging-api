const authRouter = require("express").Router()
const UserModel = require('../models/UserModel')
const UserController = require('../controllers/UserController')
const UserService = require('../services/UserService')
const AuthValidationHelper = require('../helpers/authValidationHelper')
const authValidationHelper = new AuthValidationHelper()

const userService = new UserService(UserModel())
const userController = new UserController(userService)

authRouter.post('/signup', userController.signUpUser(userService))
authRouter.post('/signin', userController.signInUser(userService))
authRouter.get('/u/profile/:username', userController.userDetail(userService, authValidationHelper))
authRouter.get('/u/:username', userController.viewUser(userService))
authRouter.put('/u/:username', userController.updateUserDetail(userService, authValidationHelper))


module.exports=authRouter