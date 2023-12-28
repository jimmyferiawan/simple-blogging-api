const { emailValidator } = require("../helpers/masking");
const { generateForgetPasswordOtp, validateOtp } = require("../services/OtpService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpModel = require("../models/otp")();

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
          // middleName: req.body.middleName || "",
          // lastName: req.body.lastName || "",
          email: req.body.email,
          mobile: req.body.mobile,
          birthdate: req.body.birthdate,
        };

        try {
          let registrasi = await UserService.tambahUser(UserReqBody);
          // console.log(["userData => ", userData]);
          // res.status(201).send(userData);
          delete UserReqBody.passwordHash;
          const dataUser = {
            username: UserReqBody.username,
            firstName: UserReqBody.firstName,
            // middleName: UserReqBody.middleName,
            // lastName: UserReqBody.lastName,
            email: UserReqBody.email,
            mobile: UserReqBody.mobile,
            birthdate: UserReqBody.birthdate,
          };
          respData.status = 201;
          respData.body.error = false;
          respData.body.message = "Registrasi Berhasil";
          respData.body.data = dataUser;
          // console.log("res => ", res);
        } catch (err) {
          let httpStatus = 500;
          if (err.errMsg != "Some error occured, please try again later.") {
            httpStatus = 400;
          }

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

      if (idUser && passUser) {
        try {
          let data = await UserService.findOneByUsernamePassword(
            idUser,
            passUser
          );
          // console.log("data => ", data)
          let token = jwt.sign(data.data, process.env.APP_SECRET, {
            expiresIn: 3000,
          });

          respData.httpStatus = 200;
          (respData.body.error = false),
            (respData.body.message = "Berhasil login");
          respData.body.accessToken = token;
        } catch (err) {
          // console.log("err => ", err)
          let httpStatus = err.rc == "99" ? 500 : 401;

          respData.httpStatus = httpStatus;
          respData.body.error = true;
          respData.body.message = err.errMsg;
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
          message: "Oops! something went wrong, please try again later",
        },
      };

      let data;
      try {
        data = await UserService.findOneByUsername(username);

        respData.httpStatus = 200;
        respData.body.error = false;
        respData.body.message = "User found!";
        respData.body.data = data.data;
      } catch (err) {
        let httpStatusCode = err.rc == "99" ? 500 : 404;

        respData.httpStatus = httpStatusCode;
        respData.body.message = err.errMsg;
      }
      res.setHeader('content-type', 'application/json; charset=utf-8')
      res.status(respData.httpStatus).send(respData.body);
    };
  }

  userDetail(UserService, AuthValidationHelper) {
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

      let validBearerHeader = authValidationHelper.isValidAuthBearerHeader(req);

      if(validBearerHeader) {
        try {
          let isUsernameExist = await UserService.getUserDetail(username);
          let validAuthorization = authValidationHelper.authorizationOwn(req);

          if (validAuthorization) {
            status = 200;
            body.error = false;
            body.message = "Ok";
            body.data = isUsernameExist.data;
          } else {
            console.log("error unauthorized request get user detail => ", req.headers);
            status = 401
            body.error = true
            body.message = "Unauthorized request"
            delete body.data;
          }
        } catch (err) {
          console.log("error general error => ", err);
          status = 500
          body.error = true
          body.message = err.errMsg
        }
      } else {
        console.log("error unauthorized request get user detail => ", req.headers);
        status = 401
        body.error = true
        body.message = "Unauthorized request"
      }
      res.status(status).send(body);
    }
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
        // middleName: "",
        // lastName: "",
        mobile: "",
        email: "",
        birthdate: "",
        intro: "",
      };
      let validBearerHeader = authValidationHelper.isValidAuthBearerHeader(req);
      let validRequstBody = authValidationHelper.authRequestBodyValidation(req);

      if (validBearerHeader) {
        if (validRequstBody) {
          try {
            let isUsernameExist = await UserService.findOneByUsername(username);
            let validAuthorization = authValidationHelper.authorizationOwn(req);
            // console.log("validAuthorization => ", validAuthorization);
            if (validAuthorization) {
              UserReqUpdate.username = req.body.username;
              UserReqUpdate.firstName = req.body.firstName;
              // UserReqUpdate.middleName = req.body.middleName;
              // UserReqUpdate.lastName = req.body.lastName;
              UserReqUpdate.mobile = req.body.mobile;
              UserReqUpdate.email = req.body.email;
              UserReqUpdate.birthdate = req.body.birthdate;
              UserReqUpdate.intro = req.body.intro;
              let data = await UserService.updateDetailByUsername(
                username,
                UserReqUpdate
              );

              status = data.httpStatusCode;
              body.error = data.body.error;
              if(data.httpStatusCode == 200) {
                // data.body.data = UserReqUpdate;
                body.data = UserReqUpdate;
                body.message = "Ok.";
              } else {
                body.data = null
                body.message = data.body.errMsg
              }
              console.log("data => ", {body, status})
            }
          } catch (err) {
            console.log("err => ", err);
            body = {
              error: true,
              message: "Unauthorized request",
            }
            status = 401;
          }
        } else {
          body.error = true
          body.message = "missing mandatory field"
          status = 400
        }
      }

      res.status(status).send(body);
    };
  }

  // updateUserPassword(UserService, AuthValidationHelper) {
  //   const authValidationHelper = AuthValidationHelper;
  //   let { status, body } = {
  //     status: 401,
  //     body: {
  //       error: true,
  //       message: "Unauthorized request",
  //     },
  //   };

  //   return (req, res, next) => {};
  // }

  // updateEmailConfirmed(UserService) {
  //   const { status, body } = {
  //     status: 401,
  //     body: {
  //       err: true,
  //       errMsg: "Unauthorized request",
  //     },
  //   };
  // }

  verifyForgetPasswordData(UserService) {
    let { status, body } = {
      status: 401,
      body: {
        error: true,
        message: "Unauthorized request",
      },
    };

    return async (req, res, next) => {
      const usernameOrEmailOrPhone = req.params.usernameOrEmailOrPhone;

      let dataQuery = {
        status: 500,
        body: {}
      };

      try {
        dataQuery = await UserService.checkForgetPasswordData(usernameOrEmailOrPhone);
        console.log("Success verifyForgetPasswordData => ", dataQuery)
        delete dataQuery.body.data;
      } catch (error) {
        console.log("Error verifyForgetPasswordData => ", error)
        dataQuery = error
      }

      res.status(dataQuery.status).send(dataQuery.body);
    }
  }

  sendForgetPasswordToken(UserService, OtpModel) {
    const otpModel = OtpModel;
    let { status, body } = {
      status: 401,
      body: {
        error: true,
        message: "Unauthorized request",
      },
    };

    return async (req, res, next) => {
      const usernameOrEmailOrPhone = req.params.usernameOrEmailOrPhone;

      let dataQuery = {
        status: 500,
        body: {}
      };

      let sendToken = {
        status: 500,
        body: {
          error: true,
          message: "",
        }
      }

      try {
        dataQuery = await UserService.checkForgetPasswordData(usernameOrEmailOrPhone);
        console.log("Success verifyForgetPasswordData => ", dataQuery)
        const sendMail = await generateForgetPasswordOtp(otpModel, dataQuery.body.data.email, dataQuery.body.data.id);
        console.log("Success generateForgetPasswordOtp => ", sendMail)
        sendToken = sendMail;
      } catch (error) {
        console.log("Error verifyForgetPasswordData => ", error)
        sendToken = error
      }

      res.status(sendToken.status).send(sendToken.body);
    }
  }

  resetPassword(UserService, OtpModel = otpModel) {
    let { status, body } = {
      status: 401,
      body: {
        error: true,
        message: "Unauthorized request",
      },
    };
    
    return async (req, res, next) => {
      const email = req.body.email;
      const newPassword = req.body.newPassword;
      const forgetPasswordToken = req.body.token;

      if(email && newPassword && forgetPasswordToken) {
        if(newPassword.length >= 6) {
        // if(emailValidator(email) && newPassword.length >= 6) {
          try {
            let dataQuery = await UserService.checkForgetPasswordData(email);
            await validateOtp(otpModel, dataQuery.body.data.email, forgetPasswordToken);
            await this.UserService.forgetPasswordSetNewPassword(dataQuery.body.data.email, bcrypt.hashSync(newPassword, 10));
            status = 200;
            body.error = false;
            body.message = "Ok";
          } catch (error) {
            console.log(error)
            status = error.status
            body = error.body
          }
        } else {
          status = 400
          body.error = true;
          body.message = "Missing Request requirement"
        }
      } else {
        status = 400
        body.error = true;
        body.message = "Missing Request field";
      }

      res.status(status).send(body);
    }
  }
}

module.exports = UserController;
