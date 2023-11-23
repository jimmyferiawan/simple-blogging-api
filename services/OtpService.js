const { where } = require("sequelize");
const { generateActivation } = require("../helpers/hashPostId");
const OtpModel = require("../models/otp")();
const UserModel = require("../models/UserModel")();
const ACTIVATION_CATEGORY = "registration_activation_url";
const { sendActivationMail } = require("../helpers/mailSender");

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

const generateOtp = () => {};

const validateOtp = () => {};

const sendOtpEmail = () => {};

module.exports = { generateActivationLink, activateUser };
