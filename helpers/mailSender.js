const nodemailer = require("nodemailer");

const sendMail = async (emailDestination, subject, body) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,//"bliss.jagoanhosting.com",
    port: process.env.SMTP_PORT,//465,
    auth: {
      user: process.env.SMTP_USER,//"otp-noreply@rubaruba.my.id",
      pass: process.env.SMTP_PASS,//"jimyferi1000",
    },
  });

  const resp = { error: true, message: "" };

  try {
    const info = await transport.sendMail({
      from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_USER}>`, // sender address
      to: emailDestination, // list of receivers
      subject: subject, // Subject line
      // text: "Hello world?", // plain text body
      html: body, // html body
    });
    console.log("Message sent: %s", info.messageId);

    return { error: false, message: info.messageId };
  } catch (error) {
    throw new Error(resp);
  }
};

const sendOtpMail = async (emailDestination, otp) => {
  let emailBody = `<b>OTP Anda : ${otp}</b>`;
  const emailSubject = "Registration OTP";
  await sendMail(emailDestination, emailSubject, emailBody);
};

const sendActivationMail = async (emailDestination, aktivationUri) => {
  let emailBody = `<b>buka link berikut untuk aktivasi akun Anda : ${process.env.HOST_DOMAIN}/activate/${aktivationUri}</b>`;
  const emailSubject = "Registration Activation";
  await sendMail(emailDestination, emailSubject, emailBody);
};

module.exports = { sendOtpMail, sendActivationMail };
