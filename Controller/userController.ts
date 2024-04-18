import { Request, Response } from "express";
import userService from "../Service/userService";
import { ObjectId } from "mongodb";
import sendOTPByEmail from "../Utils/mailer";
import jwtUser from "../Middleware/JWT/jwtUser";
import https from "https";
import Razorpay from "razorpay";

interface ReqBody {
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirm: string;
  otp: string;
  createdAt: Date;
}

interface signupSubmitResponse {
  status: number;
  message: string;
}

const signupSubmit = async (
  req: Request<{}, {}, ReqBody>,
  res: Response<signupSubmitResponse>
) => {
  console.log(req.body);
  try {
    const newUser = await userService.createNewUser(req.body);

    if (
      newUser?.status == 201
    ) {
      res
        .status(201)
        .json({ status: 201, message: "User created successfully" });

      sendOTPByEmail(req.body.email, req.body.otp);

      const saveOtp = await userService.saveOtp({
        userId: req.body.email,
        otp: req.body.otp,
        createdAt: req.body.createdAt,
      });
    } else if (newUser?.status == 409) {
      res
        .status(409)
        .json({ status: 409, message: "User with this email already exists" });
    } else
      res
        .status(400)
        .json({ status: 400, message: "Something went wrong ,try again" });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
interface verifyOtpBody {
  userId: string;
  otp: string;
  createdAt: Date;
  purpose?: string;
}
interface getOtp {
  _id: ObjectId;
  userId: string;
  otp: string;
  createdAt: Date;
}

const verifyOtp = async (
  req: Request<{}, {}, verifyOtpBody>,
  res: Response<signupSubmitResponse>
) => {
  try {

    const getSavedOtp = await userService.getSavedOtp(req.body.userId);
    console.log(getSavedOtp, "666754646");

    if (getSavedOtp) {
      const expiryTime = new Date(getSavedOtp.createdAt);
      expiryTime.setMinutes(expiryTime.getMinutes() + 10);

      const currentTime = Date.now();
      console.log(req.body.otp, getSavedOtp.otp, "two otps");

      if (
        req.body.otp === getSavedOtp.otp &&
        currentTime < expiryTime.getTime()
      ) {
        if (!req.body.purpose) {
          await userService.setVerifiedTrue(req.body.userId);
        }
        res.status(201).json({ status: 201, message: "otp verified" });
      } else {
        res
          .status(401)
          .json({ status: 401, message: "OTP verification failed " });
      }
    } else {
      res.status(404).json({ status: 404, message: "OTP expired" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

const resendOTP = async (req: Request, res: Response) => {
  try {
    sendOTPByEmail(req.body.userId, req.body.otp);
    const saveOtp = await userService.saveOtp(req.body);
    if (saveOtp?.status === 200) res.status(200).json({ status: 200 });
   else res.status(400).json({ status: 400 });
  } catch (error) {
    res.status(500).json({ status: 500 });
  }
};

interface loginSubmitResponse {
  status: number;
  message: string;
  userData?: string;
  token?: string;
}

const loginSubmit = async (
  req: Request<{}, {}, ReqBody>,
  res: Response<loginSubmitResponse>
) => {
  console.log(req.body);

  try {
    const verifyUser = await userService.verifyLoginUser(req.body);

    if (verifyUser?.userData !== null && verifyUser?.status === 201) {
      const token = jwtUser.generateToken(
        verifyUser?.userData,
        verifyUser.ObjectId
      );
      res.status(201).json({
        status: 201,
        message: "User verification successful",
        userData: verifyUser.userData,
        token: token,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "User login failed. Invalid credentials.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const id = (req as any).userEmail;
    const response = await userService.getUser(id);
    if (response?.message === "success")
    console.log(response.data,'userdat>>>>>')
      res.status(201).json({ status: 201, user: response?.data });
    if (response?.message === "error")
      res.status(500).json({ status: 500, user: null });
    if (response?.message === "Not found")
      res.status(400).json({ status: 400, user: null });
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "req.body update");
    const userEmail = (req as any).userEmail;
    const updateUser = await userService.updateUser(req.body, userEmail);

    if (updateUser?.message === "success")
      res.status(201).json({ status: 201 });
    else res.status(400).json({ status: 400 });
  } catch (error) {
    console.log(error, "erro in updating user data at controller");
  }
};

const getJobs = async (req: Request, res: Response) => {
  try {
    console.log(req.body,'body>>>controllerrr')
    const pageNumber: string | number = req.query.page as string;
    const jobsPerPage: string | number = req.query.jobsPerPage as string;
    let userEmail = ''
   if((req as any).userEmail)  userEmail = (req as any).userEmail
    const getJobs = await userService.getJobs(
      Number(pageNumber),
      Number(jobsPerPage),
      req.body,
      userEmail
    );
    if(getJobs && getJobs.data) console.log(getJobs.data.length,'length');
    if (getJobs?.message === "success")
      res.status(201).json({
        jobData: getJobs.data,
        totalJobs: getJobs.totalPages,
        status: 201,
      });
    else  res.status(400).json({ jobData: null, totalJobs: null, status: 400 });
  } catch (error) {
    console.log("error happened in usercontroller for fetching jobs",error);
  }
};

const saveForgotOtp = async (req: Request, res: Response) => {
  try {
    const checkUserExists = await userService.checkUserExists(req.body.userId);

    console.log(checkUserExists, "checkUserExists");

    if (checkUserExists?.message == "user exists") {
      sendOTPByEmail(req.body.userId, req.body.otp);
      await userService.saveOtp(req.body);

      res.status(201).json({ status: 201 });
    } else if (checkUserExists?.message == "user not found") {
      console.log(66144987817);

      res.status(404).json({ status: 404 });
    } else res.status(400).json({ status: 400 });
  } catch (error) {
    res.status(500).json({ status: 500 });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const response = await userService.resetPassword(req.body);
    console.log(response, "resetpassword response");

    if (response.message === "success") res.status(201).json({ status: 201 });
    else res.status(404).json({ status: 404 });
  } catch (error) {
    console.log("error in resetPassword at controller");
    res.status(500).json({ status: 500 });
  }
};

const getJobData = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const response = await userService.getJobData(id);
    if (response && response.message === "success")
      res.json({ jobDataFetched: response.data, status: 201 });
    else res.json({ jobDataFetched: null, status: 404 });
  } catch (error) {
    console.log(error, "error in fetching jobdata at controller");
    res.json({ jobDataFetched: null, status: 500 });
  }
};

const saveAppliedJob = async (req: Request, res: Response) => {
  try {
    const _id = (req as any).userId;
    const userEmail = (req as any).userEmail;
    const updatedBody = { ...req.body, userId: _id, userEmail: userEmail };
    const response = await userService.saveAppliedJob(updatedBody);
    if (response.message === "success")
      res.json({ status: 201, appliedJob: response.appliedJob });
    else res.json({ status: 400 });
  } catch (error) {
    console.log(error, "error in saving applied job at controller");
    res.json({ status: 500 });
  }
};

const followAndUnfollow = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "value");

    const userId = (req as any).userId;
    const response = await userService.followAndUnfollow(
      req.body.HRId,
      req.body.value,
      userId
    );
    console.log(response, "res---follow unfollow");

    if (response.message == "success") res.status(200).send("Changed successfully");
    else res.status(400).send("follow unfollow failed");
  } catch (error) {
    console.log(error, "error in follow and unfollow hr at controller");
    res.status(500);
  }
};
const downloadFileFromChat = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "body---->>>>");

    const { url: pdfHttpLink, fileName } = req.body;

    https
      .get(pdfHttpLink, (pdfResponse) => {
        console.log(fileName, "filename");

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Type", "application/pdf");

        pdfResponse.pipe(res);
      })
      .on("error", (err) => {
        console.error("Error downloading PDF:", err);
        res.status(500).send("Error downloading PDF");
      });
  } catch (error) {
    console.log(error, "error happened in download file at hr controller");
    res.status(500).send("Internal Server Error");
  }
};

const getPlans = async (req: Request, res: Response) => {
  try {
    const response = await userService.getPlans();
    console.log(response, "response---getplans");
    if ((response.message = "success"))
      res.json({ status: 201, planDatas: response.data });
    else res.json({ status: 400, planDatas: null });
  } catch (error) {
    console.log("error happened in get all plan data in admincontroller");
    res.json({ status: 500, planDatas: null });
  }
};

const savePayment = async (req: Request, res: Response) => {
  try {
    const _id = (req as any).userId;
    const userEmail = (req as any).userEmail;
    const response = await userService.savePayment(req.body, _id, userEmail);
    if (response) res.status(200).send("Payment saved successfully");
    else res.status(400).send("Bad Request");
  } catch (error) {
    console.log("error happened in save payment in admincontroller");
    res.status(500).send("Something Went wrong,try again");
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const options = {
      amount,
      currency: "INR",
      receipt: "order_rcptid_11",
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
    console.error("Error:", error);
  }
};

const getPrevChatUsers = async (req: Request, res: Response) => {
  try {
    const userEmail = (req as any).userEmail;
    const response = await userService.getPrevChatUsers(userEmail);
    console.log(response,'res')
    if (response.success === true)
      res.status(201).json({ chatData: response.data });
    else res.status(404).json({ chatData: null });
  } catch (error) {
    res.status(500).json({ chatData: null });
  }
};

export default {
  signupSubmit,
  verifyOtp,
  resendOTP,
  loginSubmit,
  getUser,
  updateUser,
  getJobs,
  saveForgotOtp,
  resetPassword,
  getJobData,
  saveAppliedJob,
  followAndUnfollow,
  downloadFileFromChat,
  getPlans,
  savePayment,
  createOrder,
  getPrevChatUsers,
};
