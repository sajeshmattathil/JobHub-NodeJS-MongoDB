import { Request, Response } from "express";
import userService from "../Service/userService";
import { ObjectId } from "mongodb";
import sendOTPByEmail from "../Utils/mailer";
import jwtUser from "../Middleware/JWT/jwtUser";

try {
} catch (error) {}

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
    console.log(newUser, "$$$$");

    if (newUser?.message == "User created") {
      res
        .status(201)
        .json({ status: 201, message: "User created successfully" });

      sendOTPByEmail(req.body.email, req.body.otp);

      const saveOtp = await userService.saveOtp({
        userId: req.body.email,
        otp: req.body.otp,
        createdAt: req.body.createdAt,
      });
    } else if (newUser?.message == "exists") {
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
    console.log(req.body, "hello");

    const getSavedOtp = await userService.getSavedOtp(req.body.userId);
    console.log(getSavedOtp, "666754646");

    if (getSavedOtp) {
      const expiryTime = new Date(getSavedOtp.createdAt);
      expiryTime.setMinutes(expiryTime.getMinutes() + 10);

      const currentTime = Date.now();

      if (
        req.body.otp === getSavedOtp.otp &&
        currentTime < expiryTime.getTime()
      ) {
        const setVerifiedTrue = await userService.setVerifiedTrue(
          req.body.userId
        );
        res.status(201).json({ status: 201, message: "User verified" });
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

const resendOTP =async (req : Request,res : Response)=>{
  try {
    sendOTPByEmail(req.body.userId, req.body.otp);

    const saveOtp = await userService.saveOtp(req.body);
    if(saveOtp?.message === 'success') res.status(200).json({status : 200})
     res.status(400).json({status : 400})

  } catch (error) {
    
  }
}

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

    console.log(verifyUser.userData, "verify user");

    if (verifyUser?.userData) {
      const token = jwtUser.generateToken(verifyUser.userData);
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

const getUser = async (req : Request,res : Response)=>{
  try {
    const id = req.params.userId
    const response = await userService.getUser(id)
    if(response?.message === 'success') res.status(201).json({status :201,user : response?.data})
    if(response?.message === 'error') res.status(500).json({status :500,user : null})
    if(response?.message === 'Not found') res.status(400).json({status :400,user : null})
    
  } catch (error) {
    console.log('Something went wrong',error)
  }
}

const updateUser = async (req : Request,res : Response)=>{
  try {
    console.log(req.body,'req.body update');
    
    const updateUser = await userService.updateUser(req.body)

    if(updateUser?.message === 'success') res.status(201).json({status : 201})

    else res.status(400).json({status : 400})
    
  } catch (error) {
    
  }
}
export default {
  signupSubmit,
  verifyOtp,
  resendOTP,
  loginSubmit,
  getUser,
  updateUser
};
