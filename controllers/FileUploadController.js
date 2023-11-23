function imageProfileUpload(uploadFileService) {
  return async (req, res) => {
    uploadFileService(req, res, function (err) {
      console.log("file => ", req.file);
      if (err) {
        console.log("error => ", err);
        res.status(500).send({
          error: true,
          message: "Terjadi kesalahan, silahkan coba beberapa saat lagi",
        });
      } else {
        res.status(200).send({
          error: false,
          message: "Ok",
          data: { fileName: req.file.filename },
        });
      }
    });
  };
}

module.exports = { imageProfileUpload };
