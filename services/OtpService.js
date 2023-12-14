const { generateActivation, generateForgetPasswordToken } = require("../helpers/hashPostId");
const OtpModel = require("../models/otp")();
const UserModel = require("../models/UserModel")();
const ACTIVATION_CATEGORY = "registration_activation_url";
const FORGET_PASSWORD_CATEGORY = "forget_password";
const { sendActivationMail, sendForgetPasswordMail } = require("../helpers/mailSender");
const { emailMasking } = require("../helpers/masking");

const generateActivationLink = (otpModel = OtpModel(), userId, userEmail) => {
  const promise = new Promise((resolve, reject) => {
    otpModel
      .create({
        otpCategory: ACTIVATION_CATEGORY,
        createdDate: new Date(),
        otpValue: generateActivation.encode([userId]),
        userEmail: userEmail,
      })
      .then((data) => {
        // console.log("generateActivationLink() | berhasil | ", data);
        sendActivationMail(userEmail, data.dataValues.otpValue);
        resolve({
          error: false,
          message: "Ok",
        });
      })
      .catch((err) => {
        console.log(
          "generateActivationLink() | error insert data to table OTP | ",
          err
        );
        reject({
          error: true,
          message: "Terjadi kesalahan, silahkan coba beberapa saat lagi",
        });
      });
  });

  return promise;
};

const sendActivationLink = () => {};

const activateUser = (activationUrl) => {
  const userId = generateActivation.decode(activationUrl);
  const promise = new Promise((resolve, reject) => {
    OtpModel.findOne({ where: { otpValue: activationUrl } })
      .then((data) => {
        console.log("berhasil => ", data.dataValues);
        if (data) {
          resolve({ error: false, message: "Ok" });
          UserModel.update(
            { emailConfirmed: "Y" },
            { where: { id: userId[0] } }
          )
            .then((dataUser) => {
              console.log("berhasil => ", dataUser);
              resolve({ error: false, message: "Ok" });
            })
            .catch((err) => {
              console.log("gagal aktivasi => ", err);
              reject({ error: true, message: "Gagal melakukan aktivasi" });
            });
        } else {
          reject({ error: true, message: "Gagal melakukan aktivasi" });
        }
      })
      .catch((err) => {
        console.log("gagal aktivasi => ", err);
        reject({ error: true, message: "Gagal melakukan aktivasi" });
      });
  });

  return promise;
};

const generateForgetPasswordOtp = (otpModel = OtpModel, userEmail, id) => {
  console.log({userEmail, id});
  const promise = new Promise((resolve, reject) => {
    const otpIssuedTime = new Date();
    const expiryOtp = new Date(otpIssuedTime.getTime() + (12*60*60000)); // current time + (jam*menit*detik)    
    const tokenParameter = [otpIssuedTime.getTime(), otpIssuedTime.getFullYear(), otpIssuedTime.getMonth(), otpIssuedTime.getDay(), otpIssuedTime.getHours(), otpIssuedTime.getMinutes(), otpIssuedTime.getSeconds(), otpIssuedTime.getMilliseconds(), id];
    console.log(["tokenParameter => ", tokenParameter]);
    
    otpModel
      .create({
        otpCategory: FORGET_PASSWORD_CATEGORY,
        createdDate: otpIssuedTime,
        otpValue: generateForgetPasswordToken.encode(tokenParameter),
        userEmail: userEmail,
        expiredDate: expiryOtp,
      })
      .then((data) => {
        // console.log("generateForgetPasswordOtp() | berhasil | ", data.dataValues);
        sendForgetPasswordMail(userEmail, data.dataValues.otpValue); // TODO : uncomment this line to send email on production
        resolve({
          status: 200,
          body: {
            error: false,
            message: `Email OTP terkirim ke ${emailMasking(userEmail)}`,
          }
        });
      })
      .catch((err) => {
        // console.log(
        //   "generateForgetPasswordOtp() | error insert data to table OTP | ",
        //   err
        // );
        reject({
          status: 500,
          body: {
            error: false,
            message: "Something went wrong",
          }
        });
      });
  });

  return promise;
};

const validateOtp = (otpModel = OtpModel, userEmail, forgetPasswordtoken) => {
  console.log({userEmail, forgetPasswordtoken});

  const promise = new Promise((resolve, reject) => {
    otpModel.findAll({
      limit: 1,
      order: [
        ['created_date', 'DESC']
      ],
      where: {
        otpCategory: "forget_password",
        userEmail: userEmail,
      }
    })
      .then((data) => {
        if(data.length > 0 ) {
          console.log("data[0].dataValues ", data[0].dataValues)
          if((data[0].dataValues.isUsed == 'N') && (Date.now() < data[0].dataValues.expiredDate.getTime()) && (data[0].dataValues.otpValue == forgetPasswordtoken)) {
            // if(data[0].dataValues.isUsed == 'N') {
            updateOtpUsed(otpModel, userEmail, forgetPasswordtoken)
              .then((data) => {
                resolve(data[0].dataValues);
              })
              .catch((err) => {
                reject("error 404");
              })
          } else {
            reject("error expired token");
          }
        } else {
          reject("error 404"); // TODO : specify error handler
        }
      })
      .catch((err) => {
        console.log("error => ", err)
        reject("something went wrong"); // TODO : specify error handler
      })
  });

  return promise;
};

const updateOtpUsed = (otpModel = OtpModel, userEmail, forgetPasswordtoken) => {

  const promise = new Promise((resolve, reject) => {
    otpModel.update({"isUsed": "Y"}, {
      where: {
        userEmail: userEmail,
        otpValue: forgetPasswordtoken,
      }
    })
      .then((data) => {
        // console.log("success")
        if(data) {
          data[0] == 1 ? resolve("Ok") : reject("Failed")
        }
      })
      .catch((err) => {
        // console.log("failed")
        reject(err)
      });
  });

  return promise;
}

module.exports = { generateActivationLink, activateUser, generateForgetPasswordOtp, validateOtp, updateOtpUsed };
