/* eslint-disable no-mixed-spaces-and-tabs */
import nodemailer from "nodemailer";

const sendOTPByEmail = async (email: string, otp: string) => {
  try {
    console.log(email, otp, "********");
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "74123loo@gmail.com",
        pass: "ofnmcnwftggwqith",
      },
    });

    const msg = `Dear user  OTP to reset your  login  is  ${otp}.Do not share this to any one`;

    const mailDetails = {
      from: "74123loo@gmail.com",
      //  to: email,
      to: "sajm.www@gmail.com",

      subject: "Jobzz",
      text: msg,
    };

    const send = await mailTransporter.sendMail(mailDetails);
    if (send) console.log("Otp send successfully");
    else console.log("Error in sending otp");
  } catch (error) {
    console.log(error, "Error in sendig otp");
  }
};
export default sendOTPByEmail;
