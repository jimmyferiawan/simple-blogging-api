const multer = require("multer");

function imageProfileUpload(uploadFileService) {
  return async (req, res) => {
    uploadFileService(req, res, function (err) {
      // console.log("file => ", req.file);
      if (err) {
        let body = {error: true, message: "Terjadi kesalahan, silahkan coba beberapa saat lagi"}
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.log("error => ", err.code);
          switch (err.code) {
            case "LIMIT_FILE_SIZE":
              body.message = "File size should be under 2MB"
              break;
          
            default:
              break;
          }
        }
        // console.log("error => ", err);
        res.status(500).send(body);
      } else {
        res.status(200).send({
          error: false,
          message: "Ok",
          data: { fileName: req.file.filename || ""},
        });
      }
    });
  };
}

module.exports = { imageProfileUpload };
