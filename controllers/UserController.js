const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  UserService = null;

  constructor(userService) {
    // console.log(["userService => ", userService]);
    this.UserService = userService;
  }

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
          // console.log("err => ", err)
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
    };
  }

  updateUserDetail(UserService, AuthValidationHelper) {
    const authValidationHelper = AuthValidationHelper;
    let { status, body } = {
      status: 401,
      body: {
        error: true,
        message: "Unauthorized request",
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
            body.data = data.body.data;
            body.error = false
          }
        } catch (err) {
          // console.log("err => ", err);
          if (err.rc) {
            if (err.rc == "01") {
              status = 404;
              body.message = "Not found";
            }
            delete err.rc;
          } else {
            status = err.httpStatusCode;
            body.error = err.body.error;
            body.message = err.body.errMsg
          }
        }
      } else {
        if (!validRequstBody) {
          status = 400;
          body.message = "Missing mandatory field";
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
