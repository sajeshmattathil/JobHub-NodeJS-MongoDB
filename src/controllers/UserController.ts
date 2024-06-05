import { otp } from './../interfaces/IUserInteractors';
import { Request, Response } from "express";
import { IUserInteractors } from "../interfaces/IUserInteractors";
import sendOTPByEmail from "../../Utils/mailer";
import Razorpay from "razorpay";
import https from "https";
import jwtUser from "../../Middleware/JWT/jwtUser";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../Utils";
import generateOtp from "../../Utils/otpGenertator";

@injectable()
export class UserController {
  private interactor: IUserInteractors;
  constructor(
    @inject(INTERFACE_TYPE.UserInteractor) interactor: IUserInteractors
  ) {
    this.interactor = interactor;
  }

  async signupSubmit(req: Request, res: Response): Promise<void> {
    console.log(req.body, "bodyyyy");
    try {
      const newUser = await this.interactor.createNewUser(req.body);

      console.log(newUser, "newUser");

      if (newUser?.status == 201) {
        res
          .status(201)
          .json({ status: 201, message: "User created successfully" });

        let otp = generateOtp();

        if (otp) {
          await sendOTPByEmail(req.body.email, otp);
          const saveOtp = await this.interactor.saveOtp({
            userId: req.body.email,
            otp: otp,
            createdAt: req.body.createdAt,
          });
        } else return;
      } else if (newUser?.status == 409) {
        res.status(409).json({
          status: 409,
          message: "User with this email already exists",
        });
      } else
        res
          .status(400)
          .json({ status: 400, message: "Something went wrong ,try again" });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const getSavedOtp = await this.interactor.getSavedOtp(req.body.userId);

      if (getSavedOtp && getSavedOtp.createdAt !== undefined) {
        const expiryTime = new Date(getSavedOtp.createdAt);
        expiryTime.setMinutes(expiryTime.getMinutes() + 10);

        const currentTime = Date.now();
        console.log(req.body.otp, getSavedOtp.otp, "two otps");

        if (
          req.body.otp === getSavedOtp.otp &&
          currentTime < expiryTime.getTime()
        ) {
          if (!req.body.purpose) {
            await this.interactor.setVerifiedTrue(req.body.userId);
          }
          res.status(200).json({ status: 200, message: "Welcome to Job Hub " });
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
  }

  async resendOTP(req: Request, res: Response) {
    try {
      const otp = generateOtp();
      if (otp) {
        await sendOTPByEmail(req.body.userId, otp);
        req.body.otp = otp
        const saveOtp = await this.interactor.saveOtp(req.body);
        if (saveOtp?.status === 200) res.status(200).json({ status: 200 });
        else res.status(400).json({ status: 400 });
      } else {
        res.status(400).json({ status: 400 });
      }
    } catch (error) {
      res.status(500).json({ status: 500 });
    }
  }

  // interface loginSubmitResponse {
  //   status: number;
  //   message: string;
  //   userData?: string;
  //   token?: string;
  // }

  async loginSubmit(req: Request, res: Response) {
    console.log(req.body);
    try {
      const verifyUser = await this.interactor.verifyLoginUser(req.body);

      if (
        verifyUser?.userData !== undefined &&
        verifyUser.ObjectId !== undefined &&
        verifyUser?.userData !== null &&
        verifyUser?.status === 201
      ) {
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
  }

  async getUser(req: Request, res: Response) {
    try {
      const id = (req as any).userEmail;
      const response = await this.interactor.getUser(id);
      if (response?.status === 200) console.log(response.data, "userdat>>>>>");
      res.status(201).json({ status: 201, user: response?.data });
      if (response?.status === 500)
        res.status(500).json({ status: 500, user: null });
      if (response?.status === 404)
        res.status(400).json({ status: 400, user: null });
    } catch (error) {
      res.status(500).json({ status: 500, user: null });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      console.log(req.body, "req.body update");
      const userEmail = (req as any).userEmail;
      const updateUser = await this.interactor.updateUser(req.body, userEmail);

      if (updateUser?.status === 201) res.status(201).json({ status: 201 });
      else res.status(400).json({ status: 400 });
    } catch (error) {
      res.status(500).json({ status: 500 });
    }
  }

  async getJobs(req: Request, res: Response) {
    try {
      const pageNumber: string | number = req.query.page as string;
      const jobsPerPage: string | number = req.query.jobsPerPage as string;
      let userEmail = "";
      if ((req as any).userEmail) userEmail = (req as any).userEmail;
      const getJobs = await this.interactor.getJobs(
        Number(pageNumber),
        Number(jobsPerPage),
        req.body,
        userEmail
      );
      if (getJobs?.status === 201)
        res.status(201).json({
          jobData: getJobs.data,
          totalJobs: getJobs.totalPages,
          status: 201,
        });
      else
        res.status(400).json({ jobData: null, totalJobs: null, status: 400 });
    } catch (error) {
      res.status(500).json({ jobData: null, totalJobs: null, status: 500 });
    }
  }

  async saveForgotOtp(req: Request, res: Response) {
    try {
      const checkUserExists = await this.interactor.checkUserExists(
        req.body.userId
      );
      const otp = generateOtp()
      if (checkUserExists?.status === 200 && otp) {
        sendOTPByEmail(req.body.userId, otp);
        req.body.otp = otp
        await this.interactor.saveOtp(req.body);
        res.status(201).json({ status: 201 });
      } else if (checkUserExists?.status === 404) {
        res.status(404).json({ status: 404 });
      } else res.status(400).json({ status: 400 });
    } catch (error) {
      res.status(500).json({ status: 500 });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const response = await this.interactor.resetPassword(req.body);
      if (response.status === 201) res.status(201).json({ status: 201 });
      else res.status(404).json({ status: 404 });
    } catch (error) {
      res.status(500).json({ status: 500 });
    }
  }

  async getJobData(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const response = await this.interactor.getJobData(id);
      if (response && response.status === 201)
        res.json({ jobDataFetched: response.data, status: 201 });
      else res.json({ jobDataFetched: null, status: 404 });
    } catch (error) {
      res.json({ jobDataFetched: null, status: 500 });
    }
  }

  async saveAppliedJob(req: Request, res: Response) {
    try {
      const _id = (req as any).userId;
      const userEmail = (req as any).userEmail;
      const updatedBody = { ...req.body, userId: _id, userEmail: userEmail };
      const response = await this.interactor.saveAppliedJob(updatedBody);
      if (response.status == 201)
        res.json({ status: 201, appliedJob: response.appliedJob });
      else res.json({ status: 400 });
    } catch (error) {
      res.json({ status: 500 });
    }
  }

  async followAndUnfollow(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const response = await this.interactor.followAndUnfollow(
        req.body.HRId,
        req.body.value,
        userId
      );
      if (response.status == 200) res.status(200).send("Changed successfully");
      else res.status(400).send("follow unfollow failed");
    } catch (error) {
      res.status(500);
    }
  }
  async downloadFileFromChat(req: Request, res: Response) {
    try {
      const { url: pdfHttpLink, fileName } = req.body;
      https
        .get(
          pdfHttpLink,
          (pdfResponse: {
            pipe: (arg0: Response<any, Record<string, any>>) => void;
          }) => {
            console.log(fileName, "filename");
            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${fileName}"`
            );
            res.setHeader("Content-Type", "application/pdf");
            pdfResponse.pipe(res);
          }
        )
        .on("error", (err: any) => {
          res.status(500).send("Error downloading PDF");
        });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }

  async getPlans(req: Request, res: Response) {
    try {
      const response = await this.interactor.getPlans();
      if (response.status == 201)
        res.json({ status: 201, planDatas: response.data });
      else res.json({ status: 400, planDatas: null });
    } catch (error) {
      res.json({ status: 500, planDatas: null });
    }
  }

  async savePayment(req: Request, res: Response) {
    try {
      const _id = (req as any).userId;
      const userEmail = (req as any).userEmail;
      const response = await this.interactor.savePayment(
        req.body,
        _id,
        userEmail
      );
      if (response) res.status(200).send("Payment saved successfully");
      else res.status(400).send("Bad Request");
    } catch (error) {
      res.status(500).send("Something Went wrong,try again");
    }
  }

  // const razorpay = new Razorpay({
  //   key_id: process.env.RAZORPAY_ID_KEY!,
  //   key_secret: process.env.RAZORPAY_SECRET_KEY!,
  // });

  async createOrder(req: Request, res: Response) {
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_ID_KEY!,
        key_secret: process.env.RAZORPAY_SECRET_KEY!,
      });
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
  }

  async getPrevChatUsers(req: Request, res: Response) {
    try {
      const userEmail = (req as any).userEmail;
      const response = await this.interactor.getPrevChatUsers(userEmail);
      if (response.status === 201)
        res.status(201).json({ chatData: response.data });
      else res.status(404).json({ chatData: null });
    } catch (error) {
      res.status(500).json({ chatData: null });
    }
  }
}
