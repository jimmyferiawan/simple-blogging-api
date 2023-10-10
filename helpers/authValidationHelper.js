const jwt = require("jsonwebtoken");

class AuthValidationHelper {
  nullabelValidation(str) {
    let isValid = false;
    if (
      str != null &&
      str != undefined &&
      str != "" &&
      typeof str === "string"
    ) {
      isValid = true;
    }

    return isValid;
  }

  bodyPasswordValidation(req) {
    let isValidBody = false;
    if (
      this.nullabelValidation(req.body.password) &&
      this.nullabelValidation(req.body.newPassword)
    ) {
      isValidBody = true;
    }

    return isValidBody;
  }

  authRequestBodyValidation(req) {
    let isValidBody = true;
    if (
      !req.body.username ||
      !req.body.firstName ||
      !req.body.mobile ||
      !req.body.email
    ) {
      isValidBody = false;
    }

    // console.log("validBody => ", isValidBody)
    return isValidBody;
  }

  isValidAuthBearerHeader(req) {
    let isValidBearer = false;
    // if (this.authRequestBodyValidation(req)) {
    if (
      req?.headers &&
      req?.headers.authorization &&
      req?.headers.authorization.split(" ")[0] == "Bearer"
    ) {
      // console.log("valid header");
      isValidBearer = true;
    }
    // }

    return isValidBearer;
  }

  authorize(req) {
    let isValidJWT = false;

    // console.log(`header Authorization : ${req.headers.authorization}`);
    // if (this.isValidAuthBearerHeader(req)) {
    try {
      jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.APP_SECRET
      );
      isValidJWT = true;
    } catch (error) {
      // console.log(error);
    }

    return isValidJWT;
  }

  authorizationOwn(req) {
    let reqToken;
    let isValidOwner = false;
    reqToken = req.headers.authorization.split(" ")[1];
    // console.log(`reqToken = ${reqToken}`);
    jwt.verify(reqToken, process.env.APP_SECRET, function (err, data) {
      // console.log(["err => ", err, "data => ", data]);
      if (err) {
        // console.log(err);
      } else {
        // console.log("dataUser => ", data);
        if (data.username == req.params.username) {
          isValidOwner = true;
        }
      }
    });

    return isValidOwner;
  }
}

module.exports = AuthValidationHelper;
