const nodemailer = require("nodemailer");

const config = {
  host: "smtp.daum.net",
  port: 465,
  secure: true,
  auth: {
    user: "gywns8339@daum.net",
    pass: "mvufsqgebsvzsuwf",
  },
};

const sendEmail = async (data) => {
  // Promise객체로 반환
  return new Promise(async (resolve, reject) => {
    let tp = nodemailer.createTransport(config);
    try {
      let result = await tp.sendMail(data);
      console.log("메일성공 ", result);
    } catch (err) {
      console.log("메일실패 ", err);
    }
  });
};

module.exports = {
  sendEmail,
};
