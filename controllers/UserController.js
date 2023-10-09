const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  UserService = null;

  constructor(userService) {
    // console.log(["userService => ", userService]);
    this.UserService = userService;
  }

  // requestBodyValidation(reqBody) {
  //   let isValidBody = true;
  //   if (
  //     !reqBody.username ||
  //     !reqBody.firstName ||
  //     !reqBody.mobile ||
  //     !reqBody.email
  //   ) {
  //     isValidBody = false;
  //   }

  //   return isValidBody;
  // }

  // isValidAuthBearerHeader(req) {
  //   if (
  //     req?.headers &&
  //     req?.headers.authorization &&
  //     req?.headers.authorization.split(" ")[0] == "Bearer"
  //   ) {
  //     // console.log("valid header");
  //     return true;
  //   } else {
  //     // console.log("invalid header");
  //     return false;
  //   }
  // }

  // unAuthResponse(res, respCode, msg = "Oops! something went wrong") {
  //   res.status(respCode).send({
  //     error: true,
  //     message: msg,
  //   });
  // }

  signUpUser(UserService) {
    return async (req, res, next) => {
      let respData = {
        status: 400,
        body: {
          error: true,
          message: "Mandatory field should not be empty",
        },
      };

      if (
        req.body.username ||
        req.body.password ||
        req.body.firstName ||
        req.body.mobile ||
        req.body.email
      ) {
        const UserReqBody = {
          username: req.body.username,
          passwordHash: bcrypt.hashSync(req.body.password, 10),
          firstName: req.body.firstName,
          middleName: req.body.middleName || "",
          lastName: req.body.lastName || "",
          email: req.body.email,
          mobile: req.body.mobile,
        };

        try {
          let registrasi = await UserService.tambahUser(UserReqBody);
          // console.log(["userData => ", userData]);
          // res.status(201).send(userData);
          delete UserReqBody.passwordHash;
          const dataUser = {
            username: UserReqBody.username,
            firstName: UserReqBody.firstName,
            middleName: UserReqBody.middleName,
            lastName: UserReqBody.lastName,
            email: UserReqBody.email,
            mobile: UserReqBody.mobile,
          };
          respData.status = 201;
          respData.body.error = false;
          respData.body.message = "Registrasi Berhasil";
          respData.body.data = dataUser;
          // console.log("res => ", res);
        } catch (err) {
          let httpStatus = 500;
          err.error != (null || undefined)
            ? (httpStatus = 403)
            : (httpStatus = 500);

          respData.status = httpStatus;
          respData.body.error = true;
          respData.body.message = err.errMsg;
        }
      }

      res.status(respData.status).send(respData.body);
    };
  }

  signInUser(UserService) {
    return async (req, res, next) => {
      const idUser = req.body.username;
      const passUser = req.body.password;
      // console.log("username => ", idUser, " password => ", passUser)

      const respData = {
        httpStatus: 400,
        body: {
          error: true,
          message: "Missing mandatory field",
        },
      };

      if (
        idUser != null ||
        idUser != undefined ||
        idUser != "" ||
        passUser != null ||
        passUser != undefined ||
        passUser != ""
      ) {
        try {
          let data = await UserService.findOneByUsernamePassword(idUser, passUser);
          // console.log("data => ", data)
          let token = jwt.sign(data.data, process.env.APP_SECRET, {
            expiresIn: 3000,
          });

          respData.httpStatus = 200
          respData.body.error = false,
          respData.body.message = "Berhasil login"
          respData.body.accessToken = token
        } catch (err) {
          console.log("err => ", err)
          let httpStatus = err.rc == "99" ? 500 : 401;

          respData.httpStatus = httpStatus
          respData.body.error = true
          respData.body.message = err.errMsg
        }
      }

      res.status(respData.httpStatus).send(respData.body);
    };
  }

  viewUser(UserService) {
    return async (req, res, next) => {
      let username = req.params.username;
      let respData = {
        httpStatus: 500,
        body: {
          error: true,
          message: "Oops! something went wrong, please try again later"
        }
      }

      let data;
      try {
        data = await UserService.findOneByUsername(username);

        respData.httpStatus = 200
        respData.body.error = false
        respData.body.message = "User found!"
        respData.body.data = data.data
      } catch (err) {
        let httpStatusCode = (err.rc == "99" ? 500 : 404)

        respData.httpStatus = httpStatusCode
        respData.body.message = err.errMsg
      }

      res.status(respData.httpStatus).send(respData.body)
      // UserService.findOneByUsername(username)
      //   .then((data) => {
      //     delete data.rc;

      //     res.status(200).send(data);
      //   })
      //   .catch((err) => {
      //     let httpStatus = err.rc == "99" ? 500 : 404;
      //     delete err.rc;

      //     res.status(httpStatus).send(err);
      //   });
    };
  }

  // verifyToken() {
  //   let unAuthResponse = this.unAuthResponse;
  //   let isValidAuthBearerHeader = this.isValidAuthBearerHeader;
  //   return (req, res) => {
  //     console.log(`header Authorization : ${req.headers.authorization}`);
  //     if (!isValidAuthBearerHeader(req)) {
  //       unAuthResponse(res, 404);
  //     }

  //     jwt.verify(
  //       req.headers.authorization.split(" ")[1],
  //       process.env.APP_SECRET,
  //       (err, decode) => {
  //         // console.log(decode)
  //         if (err) {
  //           let httpStatus = err.name == "TokenExpiredError" ? 403 : 400;
  //           let httpMsg =
  //             err.name == "TokenExpiredError"
  //               ? "Please login first"
  //               : "Oops! something went wrong";
  //           console.log(err.message, err.name);
  //           unAuthResponse(res, httpStatus, httpMsg);
  //         } else {
  //           res.status(200).send({
  //             error: false,
  //             message: "Ok",
  //           });
  //         }
  //       }
  //     );
  //   };
  // }

  // verifyUserOwn() {
  //   return (req, res) => {
  //     let reqToken = req.headers.authorization.split(" ")[1];
  //     console.log(`reqToken = ${reqToken}`);
  //     let dataUser = jwt.verify(reqToken, process.env.APP_SECRET);
  //     console.log(
  //       `dataUser = ${dataUser.username} == req.params.username = ${req.params.username}`
  //     );

  //     if (dataUser.username != req.params.username) {
  //       res.status(403).send({
  //         error: true,
  //         message: "Not Authorized!",
  //       });

  //       return;
  //     }

  //     res.status(200).send({ error: false, message: "Ok" });
  //   };
  // }

  // authorize(req) {
  //   let isValidJWT = false;

  //   console.log(`header Authorization : ${req.headers.authorization}`);
  //   // if (this.isValidAuthBearerHeader(req)) {
  //   jwt.verify(
  //     req.headers.authorization.split(" ")[1],
  //     process.env.APP_SECRET,
  //     (err, decode) => {
  //       if (err) {
  //         isValidJWT = false;
  //       } else {
  //         isValidJWT = true;
  //       }
  //     }
  //   );
  //   // } else {
  //   //   isValidJWT = false;
  //   // }

  //   return isValidJWT;
  // }

  // authorizationOwn(req) {
  //   let reqToken = req.headers.authorization.split(" ")[1];
  //   console.log(`reqToken = ${reqToken}`);
  //   let dataUser = jwt.verify(reqToken, process.env.APP_SECRET);
  //   console.log(
  //     `dataUser = ${dataUser.username} == req.params.username = ${req.params.username}`
  //   );
  //   let isValidOwner = false;

  //   // if(this.authorize(req)) {
  //   if (dataUser.username == req.params.username) {
  //     isValidOwner = true;
  //   } else {
  //     isValidOwner = false;
  //   }
  //   // }

  //   return isValidOwner;
  // }

  updateUserDetail(UserService, AuthValidationHelper) {
    const authValidationHelper = AuthValidationHelper;
    let { status, body } = {
      status: 401,
      body: {
        err: true,
        errMsg: "Unauthorized request",
      },
    };

    return async (req, res, next) => {
      const username = req.params.username;
      // console.log("username => ", username);

      let UserReqUpdate = {
        username: "",
        firstName: "",
        middleName: "",
        lastName: "",
        mobile: "",
        email: "",
      };
      let validBearerHeader = authValidationHelper.isValidAuthBearerHeader(req);
      let validRequstBody = authValidationHelper.authRequestBodyValidation(req);

      if (validBearerHeader && validRequstBody) {
        try {
          let isUsernameExist = await UserService.findOneByUsername(username);
          let validAuthorization = authValidationHelper.authorizationOwn(req);
          // console.log("validAuthorization => ", validAuthorization);
          if (validAuthorization) {
            UserReqUpdate.username = req.body.username;
            UserReqUpdate.firstName = req.body.firstName;
            UserReqUpdate.middleName = req.body.middleName;
            UserReqUpdate.lastName = req.body.lastName;
            UserReqUpdate.mobile = req.body.mobile;
            UserReqUpdate.email = req.body.email;
            let data = await UserService.updateDetailByUsername(
              username,
              UserReqUpdate
            );

            data.body.data = UserReqUpdate;
            status = data.httpStatusCode;
            body = data.body;
          }
        } catch (err) {
          console.log("err => ", err);
          if (err.rc) {
            if (err.rc == "01") {
              status = 404;
              body.errMsg = "Not found";
            }
            delete err.rc;
          } else {
            status = err.httpStatusCode;
            body = err.body;
          }
        }
      } else {
        if (!validRequstBody) {
          status = 400;
          body.errMsg = "Missing mandatory field";
        }
      }

      res.status(status).send(body);
    };
  }

  updateUserPassword(UserService) {
    const isValidAuthBearerHeader = this.isValidAuthBearerHeader;
    const verify = this.authorize;
    const verifyUserOwn = this.authorizationOwn;
    const { status, body } = {
      status: 401,
      body: {
        err: true,
        errMsg: "Unauthorized request",
      },
    };

    return (req, res, next) => {};
  }
}

module.exports = UserController;
