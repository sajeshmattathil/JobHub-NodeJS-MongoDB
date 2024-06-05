import { Request, Response } from "express";
import hrService from "../Service/hrService";
import sendOTPByEmail from "../Utils/mailer";
import { ObjectId } from "mongodb";
import hrRepository from "../Repository/hrRepository";
import jwtHR from "../Middleware/JWT/jwtHR";
import https from "https";
import generateOtp from "../Utils/otpGenertator";

const hrSignup = async (req: Request, res: Response) => {
  try {
    const saveHrData = await hrService.saveHrData(req.body);

    if (saveHrData?.status === 201) {
      res.status(201).json({ status: 201 });
      const otp = generateOtp();
      if (otp) {
        sendOTPByEmail(req.body.email, otp);

        const saveOtp = await hrService.saveOtp({
          userId: req.body.email,
          otp: otp,
          createdAt: req.body.createdAt,
        });
      }
    }
    if (saveHrData?.status === 200)
      res.status(409).json({ message: "HR already exists" });
  } catch (error) {
    res.status(400).json({ status: 400 });
  }
};

interface verifyOtpBody {
  userId: string;
  otp: string;
  createdAt: Date;
}
interface otpResponse {
  status: number;
  message: string;
}
const verifyOtp = async (req: Request, res: Response) => {
  try {
    const getSavedOtp = await hrService.getSavedOtp(req.body.userId);
    if (getSavedOtp && getSavedOtp.status === 200) {
      const expiryTime = new Date(getSavedOtp?.data?.createdAt);
      expiryTime.setMinutes(expiryTime.getMinutes() + 10);
      const currentTime = Date.now();
      if (
        req.body.otp === getSavedOtp?.data?.otp &&
        currentTime < expiryTime.getTime()
      ) {
        const setVerifiedTrue = await hrService.setVerifiedTrue(
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
};
const hrLogin = async (req: Request, res: Response) => {
  try {
    const response = await hrService.verifyHrData(req.body);

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
};
const createJOb = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "bodyyy ---- create job");

    const response = await hrService.saveJob(req.body);
    console.log(response, "res----createjob");

    if (response.message === "success")
      res.status(201).json({ status: 201, message: "success" });
    if (response.message === "failed")
      res.status(400).json({ status: 400, message: "Creating new Job failed" });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Something Went Wrong,try again" });
  }
};

const getJobs = async (req: Request, res: Response) => {
  try {
    console.log(11111);
    const hrEmail = req.params.id;
    console.log(hrEmail, "email");
    const pageNumber: string | number = req.query.page as string;
    const jobsPerPage: string | number = req.query.jobsPerPage as string;
    console.log(pageNumber, jobsPerPage, "----queries");

    const response = await hrService.getJobsData(
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
};

const getHR = async (req: Request, res: Response) => {
  try {
    const id = (req as any).HRId;
    console.log(id, "hr === id");
    const response = await hrService.getHR(id);

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
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await hrService.updateProfile(req.body);
    if (response?.message === "success") res.status(201).json({ status: 201 });
    else res.status(400).json({ status: 400 });
  } catch (error) {
    res.status(500).json({ status: 500 });
  }
};

const getJobDetails = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const response = await hrService.getJobDetails(jobId);

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
};

const deleteJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const response = await hrService.deleteJob(jobId);
    console.log(response, "response=== delete");
    if (response.message === "success") res.status(201).json({ status: 201 });
    else res.status(400);
  } catch (error) {
    console.log(error, "error happened in deleting job at hr controller");
    res.status(500);
  }
};

const updateJob = async (req: Request, res: Response) => {
  try {
    const response = await hrService.updateJob(req.body);
    if (response && response.message === "success") res.json({ status: 201 });
    else res.json({ status: 400 });
  } catch (error) {
    console.log(error, "error happened in updating job at hr controller");
    res.json({ status: 500 });
  }
};

const updateJobpostHRViewed = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const HRId = (req as any)._id;
    console.log(HRId, "id---->");

    const response = await hrService.updateJobpostHRViewed(jobId, HRId);
    console.log(response, "res---hr viewed");
  } catch (error) {
    console.log(
      error,
      "error happened in updating job hr viewed at hr controller"
    );
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

const shortListUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "body----shortlist");
    const response = await hrService.shortListUser(
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
};
const getShortListedUsers = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;
    console.log(jobId, "jobiddd");

    const response = await hrService.getShortListedUsers(jobId);
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
};

const removeFromShortListed = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "body---remove");
    const response = await hrService.removeFromShortListed(req.body);
    console.log(response, "ressss");
    if (response) res.status(200).send("Succefully removed from short listed");
    else res.status(400).send("Bad request");
  } catch (error) {
    console.log(
      error,
      "error happened in  getting short list  at hr controller"
    );
    res.status(500).send("Interna server error");
  }
};
const getPrevChatUsers = async (req: Request, res: Response) => {
  try {
    const HREmail = (req as any).HRId;
    const response = await hrService.getPrevChatUsers(HREmail);
    console.log(response, "res");
    if (response.success === true)
      res.status(201).json({ chatData: response.data });
    else res.status(404).json({ chatData: null });
  } catch (error) {
    res.status(500).json({ chatData: null });
  }
};
const getFollowers = async (req: Request, res: Response) => {
  try {
    const HRId = (req as any)._id;
    console.log(HRId, "id>>>>>");

    const getAllFollowers = await hrService.getFollowersData(HRId);
    console.log(getAllFollowers, "res");

    if (getAllFollowers.status === 201)
      res.status(201).json({ followersData: getAllFollowers.data });
    else res.status(406).json({ message: "No user found" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export default {
  hrSignup,
  verifyOtp,
  hrLogin,
  createJOb,
  getJobs,
  getHR,
  updateProfile,
  getJobDetails,
  deleteJob,
  updateJob,
  updateJobpostHRViewed,
  downloadFileFromChat,
  shortListUser,
  getShortListedUsers,
  removeFromShortListed,
  getPrevChatUsers,
  getFollowers,
};
