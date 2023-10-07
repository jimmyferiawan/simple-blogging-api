const jwt = require("jsonwebtoken");

class AuthValidationHelper {
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
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.APP_SECRET,
      (err, decode) => {
        if (err) {
          isValidJWT = false;
        } else {
          isValidJWT = true;
        }
      }
    );

    return isValidJWT;
  }

  authorizationOwn(req) {
    let reqToken;
    // console.log(`reqToken = ${reqToken}`);
    let dataUser;
    // console.log(
    //   `dataUser = ${dataUser.username} == req.params.username = ${req.params.username}`
    // );
    let isValidOwner = false;

    // if (this.authRequestBodyValidation) {
    //   if (this.isValidAuthBearerHeader(req)) {
        reqToken = req.headers.authorization.split(" ")[1];
        dataUser = jwt.verify(reqToken, process.env.APP_SECRET);
        if (this.authorize) {
          if (dataUser.username == req.params.username) {
            isValidOwner = true;
          }
        }
    //   }
    // }

    return isValidOwner;
  }
}

module.exports = AuthValidationHelper;
