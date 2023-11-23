const { generateAdditionalFileName } = require("../helpers/hashPostId");
const multer = require("multer")
// import { generateAdditionalFileName } from '../helpers/hashPostId'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`destination : ${process.env.WORKING_DIR}\\assets\\images`)
    cb(null, `${process.env.WORKING_DIR}\\assets\\images`);
  },
  filename: (req, file, cb) => {
    console.log(`filename : ${file.filename} | mimetype : ${file.mimetype}`)
    cb(null, generateAdditionalFileName.encode([Date.now()]) + "_" + file.originalname);
  }
});

const upload = multer({ storage: storage });
const uploadFile = upload.single("file")

module.exports = uploadFile;