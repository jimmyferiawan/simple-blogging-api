const { activateUser } = require("../services/OtpService")

const verifyRegistration = () => {
  return async (req, res, next) => {
    let activationUrl = req.params.activationUrl;

    const resp = {
      status: 400,
      body: {
        error: true,
        message: "Terjadi kesalahan"
      }
    }
    try {
      let data = await activateUser(activationUrl);
      resp.body.error = false;
      resp.body.message = "Ok";
    } catch (error) {
      console.log(`error /activate/${activationUrl} | ${error}`)
    }

    res.status(resp.status).send(resp.body)
  }
}

module.exports = {verifyRegistration}