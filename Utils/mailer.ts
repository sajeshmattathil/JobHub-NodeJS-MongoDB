/* eslint-disable no-mixed-spaces-and-tabs */
import nodemailer from "nodemailer";

const sendOTPByEmail = async (email: string, otp: string) => {
  try {
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "74123loo@gmail.com",
        pass: "ofnmcnwftggwqith",
      },
    });

    const msg = `Your OTP is  ${otp}. This is a test OTP sent from JobHub. This message is for trial purposes only.`;

    const mailDetails = {
      from: "74123loo@gmail.com",
      to: email,

      subject: "Job Hub (Demo)",
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
