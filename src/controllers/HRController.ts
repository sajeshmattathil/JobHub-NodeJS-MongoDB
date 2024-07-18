
import { Request, Response } from "express";
import https from "https";
import { IHRInteractor } from "../interfaces/IHRInteractor";
import jwtHR from "../../Middleware/JWT/jwtHR";
import sendOTPByEmail from "../../Utils/mailer";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../Utils";
import generateOtp from "../../Utils/otpGenertator";

@injectable()
export class HRController {
  private interactor: IHRInteractor;

  constructor(@inject(INTERFACE_TYPE.HRInteractor) interactor: IHRInteractor) {
    this.interactor = interactor;
  }

  async hrSignup(req: Request, res: Response) {
    try {
      const saveHrData = await this.interactor.saveHrData(req.body);
      if (saveHrData?.status === 201) {
        res.status(201).json({ status: 201 });
        const otp = generateOtp()
        if(otp){
         await sendOTPByEmail(req.body.email,otp);

          const saveOtp = await this.interactor.saveOtp({
            userId: req.body.email,
            otp: otp,
            createdAt: req.body.createdAt,
          });
        }
      
      }
      if (saveHrData?.status === 200)
        res.status(409).json({ message: "HR already exists" });
    } catch (error) {
      res.status(400).json({ status: 400,message:'Something went wrong' });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const getSavedOtp = await this.interactor.getSavedOtp(req.body.userId);
      if (
        getSavedOtp !== undefined &&
        getSavedOtp.status === 200 &&
        getSavedOtp?.data?.createdAt !== undefined
      ) {
        const expiryTime = new Date(getSavedOtp?.data?.createdAt);
        expiryTime.setMinutes(expiryTime.getMinutes() + 10);
        const currentTime = Date.now();
        if (
          req.body.otp === getSavedOtp?.data?.otp &&
          currentTime < expiryTime.getTime()
        ) {
          const setVerifiedTrue = await this.interactor.setVerifiedTrue(
            req.body.userId
          );

          if (setVerifiedTrue && setVerifiedTrue.status === 200)
            res.status(201).json({ status: 201, message: "Hr verified" });
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
  }

  async hrLogin(req: Request, res: Response) {
    try {
      const response = await this.interactor.verifyHrData(req.body);

      if (response.data && response?.message === "verified") {
        const token = jwtHR.generateToken(req.body.email, response.data._id);
        res.status(201).json({ status: 201, token: token });
      }
      if (response?.message === "declained")
        res.status(401).json({ status: 401 });
      if (response?.message == "no user found")
        res.status(400).json({ status: 400 });
      if (response?.message === "") res.status(500).json({ status: 500 });
    } catch (error) {
      console.log("login failed ");
    }
  }

  async createJob(req: Request, res: Response) {
    try {
      console.log(req.body, "bodyyy ---- create job");

      const response = await this.interactor.saveJob(req.body);
      console.log(response, "res----createjob");

      if (response.message === "success")
        res.status(201).json({ status: 201, message: "success" });
      if (response.message === "failed")
        res
          .status(400)
          .json({ status: 400, message: "Creating new Job failed" });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Something Went Wrong,try again" });
    }
  }

  async getJobs(req: Request, res: Response) {
    try {
      console.log(11111);
      const hrEmail = req.params.id;
      console.log(hrEmail, "email");
      const pageNumber: string | number = req.query.page as string;
      const jobsPerPage: string | number = req.query.jobsPerPage as string;
      console.log(pageNumber, jobsPerPage, "----queries");

      const response = await this.interactor.getJobsData(
        hrEmail,
        Number(pageNumber),
        Number(jobsPerPage)
      );
      // console.log(response,'resoponsejobs');

      if (response?.message === "")
        res.status(201).json({
          status: 201,
          jobs: response?.data,
          totalPages: response?.totalPages,
        });
      if (response?.message === "No jobs found")
        res.status(400).json({ status: 400, jobs: "", totalPages: null });
      if (response?.message === "error")
        res.status(500).json({ status: 500, jobs: "", totalPages: null });
    } catch (error) {
      console.log(error, "error happended in fetching jobs");
    }
  }

  async getHR(req: Request, res: Response) {
    try {
      const id = (req as any).HRId;
      console.log(id, "hr === id");
      const response = await this.interactor.getHR(id);

      if (response?.message === "success") {
        res.status(201).json({ status: 201, HR: response?.data });
      }
      if (response?.message === "error")
        res.status(500).json({ status: 500, HR: null });
      if (response?.message === "Not found")
        res.status(400).json({ status: 400, HR: null });
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const response = await this.interactor.updateProfile(req.body);
      if (response?.message === "success")
        res.status(201).json({ status: 201 });
      else res.status(400).json({ status: 400 });
    } catch (error) {
      res.status(500).json({ status: 500 });
    }
  }

  async getJobDetails(req: Request, res: Response) {
    try {
      const jobId = req.params.id;
      const response = await this.interactor.getJobDetails(jobId);

      if (response.message == "success")
        res.json({ status: 201, jobData: response?.data });
      else res.json({ status: 400, jobData: null });
    } catch (error) {
      console.log(
        error,
        "error happened in fetching job details at hr controller"
      );
      res.json({ status: 500, jobData: null });
    }
  }

  async deleteJob(req: Request, res: Response) {
    try {
      const jobId = req.params.id;
      const response = await this.interactor.deleteJob(jobId);
      console.log(response, "response=== delete");
      if (response.message === "success") res.status(201).json({ status: 201 });
      else res.status(400);
    } catch (error) {
      console.log(error, "error happened in deleting job at hr controller");
      res.status(500);
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const response = await this.interactor.updateJob(req.body);
      if (response && response.message === "success") res.json({ status: 201 });
      else res.json({ status: 400 });
    } catch (error) {
      console.log(error, "error happened in updating job at hr controller");
      res.json({ status: 500 });
    }
  }

  async updateJobpostHRViewed(req: Request, res: Response) {
    try {
      const jobId = req.params.id;
      const HRId = (req as any)._id;
      console.log(HRId, "id---->");

      const response = await this.interactor.updateJobpostHRViewed(jobId, HRId);
      console.log(response, "res---hr viewed");
    } catch (error) {
      console.log(
        error,
        "error happened in updating job hr viewed at hr controller"
      );
    }
  }

  async downloadFileFromChat(req: Request, res: Response) {
    try {
      console.log(req.body, "body---->>>>");

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
        .on("error", (err) => {
          console.error("Error downloading PDF:", err);
          res.status(500).send("Error downloading PDF");
        });
    } catch (error) {
      console.log(error, "error happened in download file at hr controller");
      res.status(500).send("Internal Server Error");
    }
  }

  async shortListUser(req: Request, res: Response) {
    try {
      console.log(req.body, "body----shortlist");
      const response = await this.interactor.shortListUser(
        req.body.jobId,
        req.body.userId
      );
      console.log(response, "res----shortlist");
      if (response.message === "success") res.json({ status: 200 });
      else res.json({ status: 400 });
    } catch (error) {
      console.log(error, "error happened in short list user at hr controller");
      res.json({ status: 500 });
    }
  }

  async getShortListedUsers(req: Request, res: Response) {
    try {
      const jobId = req.params.jobId;
      console.log(jobId, "jobiddd");

      const response = await this.interactor.getShortListedUsers(jobId);
      if (response.message === "success")
        res.json({ status: 200, usersData: response.data });
      else res.json({ status: 400, usersData: null });
    } catch (error) {
      console.log(
        error,
        "error happened in  getting short list  at hr controller"
      );
      res.json({ status: 500, usersData: null });
    }
  }

  async removeFromShortListed(req: Request, res: Response) {
    try {
      console.log(req.body, "body---remove");
      const response = await this.interactor.removeFromShortListed(req.body);
      console.log(response, "ressss");
      if (response)
        res.status(200).send("Succefully removed from short listed");
      else res.status(400).send("Bad request");
    } catch (error) {
      console.log(
        error,
        "error happened in  getting short list  at hr controller"
      );
      res.status(500).send("Interna server error");
    }
  }

  async getPrevChatUsers(req: Request, res: Response) {
    try {
      const HREmail = (req as any).HRId;
      const response = await this.interactor.getPrevChatUsers(HREmail);
      console.log(response, "res");
      if (response.success === true)
        res.status(201).json({ chatData: response.data });
      else res.status(404).json({ chatData: null });
    } catch (error) {
      res.status(500).json({ chatData: null });
    }
  }

  async getFollowers(req: Request, res: Response) {
    try {
      const HRId = (req as any)._id;
      console.log(HRId, "id>>>>>");

      const getAllFollowers = await this.interactor.getFollowersData(HRId);
      console.log(getAllFollowers, "res");

      if (getAllFollowers.status === 201)
        res.status(201).json({ followersData: getAllFollowers.data });
      else res.status(406).json({ message: "No user found" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
