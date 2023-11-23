const { generateAdditionalFileName } = require("../helpers/hashPostId");
const multer = require("multer");
const path = require("path");
const { cwd } = require("process");
// import { generateAdditionalFileName } from '../helpers/hashPostId'
const workingDir = path.join(cwd(), "assets", "images")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(`destination : ${workingDir}`);
    // console.log(`filesize : ${file}`);
    cb(null, workingDir);
  },
  filename: (req, file, cb) => {
    // console.log(`filename : ${file.filename} | mimetype : ${file.mimetype}`);
    cb(null, generateAdditionalFileName.encode([Date.now()]) + "_" + file.originalname);
  },
});

const maxSize = 2 * 1024 * 1024;
const upload = multer({ storage: storage, limits: { fileSize: maxSize } });
const uploadFile = upload.single("file");

module.exports = uploadFile;
