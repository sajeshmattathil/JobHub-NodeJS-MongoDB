import { Request, Response } from "express";
import userService from "../Service/userService";
import { ObjectId } from "mongodb";
import sendOTPByEmail from "../Utils/mailer";
import jwtUser from "../Middleware/JWT/jwtUser";
import https from "https";
import Razorpay from "razorpay";
import generateOtp from "../Utils/otpGenertator";

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
  req: Request,
  res: Response
) => {
  console.log(req.body);
  try {
    const newUser = await userService.createNewUser(req.body);

    if (newUser?.status == 201) {
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

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const getSavedOtp = await userService.getSavedOtp(req.body.userId);

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
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

const resendOTP = async (req: Request, res: Response) => {
  try {
    const otp : string | undefined  = generateOtp()
     if(otp ) await sendOTPByEmail(req.body.userId, otp);
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

const loginSubmit = async (req: Request, res: Response) => {
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
    if (response?.status === 200) console.log(response.data, "userdat>>>>>");
    res.status(201).json({ status: 201, user: response?.data });
    if (response?.status === 500)
      res.status(500).json({ status: 500, user: null });
    if (response?.status === 404)
      res.status(400).json({ status: 400, user: null });
  } catch (error) {
    res.status(500).json({ status: 500, user: null });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "req.body update");
    const userEmail = (req as any).userEmail;
    const updateUser = await userService.updateUser(req.body, userEmail);

    if (updateUser?.status === 201) res.status(201).json({ status: 201 });
    else res.status(400).json({ status: 400 });
  } catch (error) {
    res.status(500).json({ status: 500 });
  }
};

const getJobs = async (req: Request, res: Response) => {
  try {
    const pageNumber: string | number = req.query.page as string;
    const jobsPerPage: string | number = req.query.jobsPerPage as string;
    let userEmail = "";
    if ((req as any).userEmail) userEmail = (req as any).userEmail;
    const getJobs = await userService.getJobs(
      Number(pageNumber),
      Number(jobsPerPage),
      req.body,
      userEmail
    );
    if (getJobs && getJobs.data) console.log(getJobs.data.length, "length");
    if (getJobs?.status === 201)
      res.status(201).json({
        jobData: getJobs.data,
        totalJobs: getJobs.totalPages,
        status: 201,
      });
    else res.status(400).json({ jobData: null, totalJobs: null, status: 400 });
  } catch (error) {
    res.status(500).json({ jobData: null, totalJobs: null, status: 500 });
  }
};

const saveForgotOtp = async (req: Request, res: Response) => {
  try {
    const checkUserExists = await userService.checkUserExists(req.body.userId);
    if (checkUserExists?.status === 200) {
      sendOTPByEmail(req.body.userId, req.body.otp);
      await userService.saveOtp(req.body);
      res.status(201).json({ status: 201 });
    } else if (checkUserExists?.status === 404) {
      res.status(404).json({ status: 404 });
    } else res.status(400).json({ status: 400 });
  } catch (error) {
    res.status(500).json({ status: 500 });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const response = await userService.resetPassword(req.body);
    if (response.status === 201) res.status(201).json({ status: 201 });
    else res.status(404).json({ status: 404 });
  } catch (error) {
    res.status(500).json({ status: 500 });
  }
};

const getJobData = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const response = await userService.getJobData(id);
    if (response && response.status === 201)
      res.json({ jobDataFetched: response.data, status: 201 });
    else res.json({ jobDataFetched: null, status: 404 });
  } catch (error) {
    res.json({ jobDataFetched: null, status: 500 });
  }
};

const saveAppliedJob = async (req: Request, res: Response) => {
  try {
    const _id = (req as any).userId;
    const userEmail = (req as any).userEmail;
    const updatedBody = { ...req.body, userId: _id, userEmail: userEmail };
    const response = await userService.saveAppliedJob(updatedBody);
    if (response.status == 201)
      res.json({ status: 201, appliedJob: response.appliedJob });
    else res.json({ status: 400 });
  } catch (error) {
    res.json({ status: 500 });
  }
};

const followAndUnfollow = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const response = await userService.followAndUnfollow(
      req.body.HRId,
      req.body.value,
      userId
    );
    if (response.status == 200) res.status(200).send("Changed successfully");
    else res.status(400).send("follow unfollow failed");
  } catch (error) {
    res.status(500);
  }
};
const downloadFileFromChat = async (req: Request, res: Response) => {
  try {
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
        res.status(500).send("Error downloading PDF");
      });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getPlans = async (req: Request, res: Response) => {
  try {
    const response = await userService.getPlans();
    if (response.status == 201)
      res.json({ status: 201, planDatas: response.data });
    else res.json({ status: 400, planDatas: null });
  } catch (error) {
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
    if (response.status === 201)
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
