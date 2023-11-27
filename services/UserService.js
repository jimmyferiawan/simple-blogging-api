// const { Model } = require("sequelize").Model;
const errMapping = require("../helpers/userErrorDef");
const bcrypt = require("bcrypt");
// const  { generateActivationLink } = require("./OtpService");
const OtpModel = require("../models/otp");

/**
 * @param {Object} UserModel Sequelize User Model
 */
class UserService {
  UserModel;
  SMTPHelper;

  constructor(UserModel, SMTPHelper) {
    if (UserModel == undefined || UserModel == null) {
      throw new Error("Please specify the correct UserModel");
    }

    this.UserModel = UserModel;
    this.SMTPHelper = SMTPHelper;
  }

  /**
   * @param {Object} userData
   * @returns {Promise}
   */
  tambahUser(userData) {
    // console.log(["UserService.this => ", this]);
    const respData = {
      error: true,
      errMsg: null,
    };
    let userModel = this.UserModel;
    let activationLinkSender = this.SMTPHelper.generateActivationLink;
    const promise = new Promise((resolve, reject) => {
      // console.log(["typeof userModel => ", typeof userModel]);
      userModel
        .create(userData)
        .then((data) => {
          // console.log("data => ", data)
          respData.error = false;
          respData.errMsg = null;
          activationLinkSender(OtpModel(), data.dataValues.id, data.dataValues.email);
          // generateActivationLink(OtpModel(), data.dataValues.id, data.dataValues.email);
          resolve(respData);
        })
        .catch((err) => {
          // console.log("error tambahUser()", err)
          respData.error = true;
          err.name == "SequelizeUniqueConstraintError"
            ? // console.log("err.fields => ", err.fields)
              (respData.errMsg = errMapping[Object.keys(err.fields)[0]])
            : (respData.errMsg = "Some error occured, please try again later.");

          reject(respData);
        });
    });

    return promise;
  }

  /**
   * @param {string} username
   * @param {string} password
   * @returns {Promise}
   */
  findOneByUsernamePassword(username, password) {
    const GENERAL_ERR = "Some error occured, please try again later.";
    const WRONG_CREDENTIALS = "Wrong Username or Password.";
    const respData = {
      error: true,
      errMsg: null,
      rc: "00",
    };

    let promise = new Promise((resolve, reject) => {
      this.UserModel.findOne({
        where: {
          username: username,
        },
      })
        .then((data) => {
          // console.log(["UserSevice.findOneByUsernamePassword() data: ", data]);
          if (data) {
            let isCorrectPassword = bcrypt.compareSync(
              password,
              data.dataValues.passwordHash
            );
            // console.log("isCorrectPassword => ", isCorrectPassword);
            if (isCorrectPassword) {
              if(data.dataValues.emailConfirmed == 'Y') {
                respData.error = false;
                // respData.errMsg = "Success";
                respData.rc = "00";
                respData.data = {
                  username: data.dataValues.username,
                  firstName: data.dataValues.firstName,
                  // middleName: data.dataValues.middleName,
                  // lastName: data.dataValues.lastName,
                  email: data.dataValues.email,
                  mobile: data.dataValues.mobile,
                };

                resolve(respData);
              } else {
                respData.error = true;
                respData.errMsg = "Please confirm the registration on your email";//UNACTIVATED_USER;
                respData.rc = "10";

                reject(respData);
              }
            } else {
              respData.error = true;
              respData.errMsg = WRONG_CREDENTIALS;
              respData.rc = "14";

              reject(respData);
            }
          } else {
            respData.error = true;
            respData.errMsg = WRONG_CREDENTIALS;
            respData.rc = "14";

            reject(respData);
          }
        })
        .catch((err) => {
          // console.log(["UserSevice.findOneByUsernamePassword() err: ", err]);
          respData.error = true;
          respData.errMsg = GENERAL_ERR;
          respData.rc = "99";
          reject(respData);
        });
    });

    return promise;
  }

  /**
   * @param {string} username
   * @returns {Promise}
   */
  findOneByUsername(username) {
    const respData = {
      error: true,
      errMsg: null,
      rc: "99",
    };

    return new Promise((resolve, reject) => {
      this.UserModel.findOne({
        attributes: [
          "username",
          "firstName",
          // "middlename",
          // "lastname",
          "intro",
          "profile",
        ],
        where: {
          username: username,
        },
      })
        .then((data) => {
          // console.log(["UserSevice.findOneByUsername() data: ", data]);
          if (data) {
            respData.error = false;
            // respData.errMsg = "Ok";
            respData.rc = "00";
            respData.data = data;

            resolve(respData);
          } else {
            respData.error = true;
            respData.errMsg = "User not found";
            respData.rc = "01";

            reject(respData);
          }
        })
        .catch((err) => {
          respData.error = true;
          respData.errMsg = "Something went wrong, please try again later";
          respData.rc = "99";

          reject(respData);
        });
    });
  }

  /**
   * @param {string} username
   * @param {Object} userData request updated value of user
   * @returns {Promise}
   */
  updateDetailByUsername(username, userData) {
    const respData = {
      httpStatusCode: 500,
      body: {
        error: true,
        errMsg: null,
      },
    };
    let promise = new Promise((resolve, reject) => {
      this.UserModel.update(userData, {
        where: {
          username: username,
        },
      })
        .then((data) => {
          // console.log("UserModel.update.data => ", data)
          respData.httpStatusCode = 200;
          respData.body.error = false;

          resolve(respData);
        })
        .catch((err) => {
          respData.body.error = true;
          if (err.name == "SequelizeUniqueConstraintError") {
            respData.httpStatusCode = 400;
            respData.body.errMsg = errMapping[Object.keys(err.fields)[0]];
          } else {
            respData.httpStatusCode = 500;
            respData.body.errMsg =
              "Some error occured, please try again later.";
          }
          console.log(["update data error => ", err]);

          reject(respData);
        });
    });

    return promise;
  }

  /**
   * @param {string} username
   * @returns {Promise}
   */
  updateEmailConfirmed(username) {
    const respData = {
      error: true,
      errMsg: null,
    };

    let promise = new Promise((resolve, reject) => {
      this.UserModel.update(
        { emailConfirmed: "Y" },
        {
          where: {
            username: username,
          },
        }
      )
        .then((data) => {
          respData.error = false;
          resolve(respData);
        })
        .catch((err) => {
          respData.errMsg =
            "Error while activation process, please try again later";
          reject(respData);
        });
    });

    return promise;
  }

  /**
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise}
   */
  updatePassword(username, newPassword) {
    const respData = {
      error: true,
      errMsg: null,
    };

    let promise = new Promise((resolve, reject) => {
      this.UserModel.update(
        { passwordHash: newPassword },
        {
          where: {
            username: username,
          },
        }
      )
      .then((data) => {
        respData.error = false
        resolve(respData)
      })
      .catch((err) => {
        respData.errMsg = 'Error while changing the password, please try again later'
        reject(respData)
      })
    });

    return promise;
  }

  getUserDetail(username) {
    const respData = {
      error: true,
      errMsg: "Something went wrong, please try again later",
      rc: "99",
    }
    
    return new Promise((resolve, reject) => {
      this.UserModel.findOne({
        attributes: [
          "username",
          "email",
          "mobile",
          "firstName",
          // "middlename",
          // "lastname",
          "intro",
          "profile",
          "birthdate"
        ],
        where: {
          username: username,
        },
      })
        .then((data) => {
          // console.log(["UserSevice.findOneByUsername() data: ", data]);
          if (data) {
            respData.error = false;
            // respData.errMsg = "Ok";
            respData.rc = "00";
            respData.data = data;

            resolve(respData);
          } else {
            respData.error = true;
            respData.errMsg = "User not found";
            respData.rc = "01";

            reject(respData);
          }
        })
        .catch((err) => {
          respData.error = true;
          respData.errMsg = "Something went wrong, please try again later";
          respData.rc = "99";

          reject(respData);
        })
    });
  }
}

module.exports = UserService;
