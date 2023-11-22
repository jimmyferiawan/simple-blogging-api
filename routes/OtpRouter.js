const { verifyRegistration } = require("../controllers/OtpController")

const otpRouter = require("express").Router()

otpRouter.get("/activate/:activationUrl", verifyRegistration())

module.exports = otpRouter