const fileUploadRouter = require("express").Router()
const { imageProfileUpload } = require("../controllers/FileUploadController")
const uploadFile = require("../services/FileUploadService")

fileUploadRouter.post("/", imageProfileUpload(uploadFile))

module.exports = fileUploadRouter