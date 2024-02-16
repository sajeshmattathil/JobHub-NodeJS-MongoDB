import { Request,Response } from "express";
import hrService from "../Service/hrService";
import sendOTPByEmail from "../Utils/mailer";
import { ObjectId } from "mongodb";
import hrRepository from "../Repository/hrRepository";
import jwtHR from "../Middleware/JWT/jwtHR";

const hrSignup =async (req:Request ,res : Response)=>{
    try {
        console.log(req.body,'hrsignup');
        const saveHrData = await hrService.saveHrData(req.body)
       
       if(saveHrData?.message === 'saved'){
        res.status(201).json({status : 201})
         sendOTPByEmail(req.body.email, req.body.otp);

        const saveOtp = await hrService.saveOtp({
          userId: req.body.email,
          otp: req.body.otp,
          createdAt: req.body.createdAt,
        });
       } 
       if(saveHrData?.message === 'exists') res.status(409).json({message : 'HR already exists'})
    } catch (error) {
        res.status(400).json({status :400})
    }
}

interface verifyOtpBody {
    userId: string;
    otp: string;
    createdAt: Date;
  }
  interface otpResponse {
    status: number;
    message: string;
  }
  const verifyOtp = async (
    req: Request<{}, {}, verifyOtpBody>,
    res: Response<otpResponse>
  ) => {
    try {
      console.log(req.body, "hello");
  
      const getSavedOtp = await hrService.getSavedOtp(req.body.userId);
      console.log(getSavedOtp, "666754646");
  
      if (getSavedOtp) {
        const expiryTime = new Date(getSavedOtp.createdAt);
        expiryTime.setMinutes(expiryTime.getMinutes() + 10);
  
        const currentTime = Date.now();
  
        if (
          req.body.otp === getSavedOtp.otp &&
          currentTime < expiryTime.getTime()
        ) {
          console.log(1111);
          const setVerifiedTrue = await hrRepository.setVerifiedTrue(
            req.body.userId
          );
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
const hrLogin = async (req : Request, res : Response)=>{
    try {
        console.log(req.body,'req.body');
        const response = await hrService.verifyHrData(req.body)
        console.log(response,'response');
        
         if(response?.message === 'verified'){
          const token = jwtHR.generateToken(req.body.email);
          res.status(201).json({status : 201,token : token})
         } 
         if(response?.message === 'declained') res.status(400).json({status : 400})
         if(response?.message == 'no user found') res.status(401).json({status : 401})
         if(response?.message === '') res.status(500).json({status : 500})
    } catch (error) {
        console.log('login failed ');       
    }
}
const  createJOb = async (req : Request, res : Response)=>{
  try {
    console.log(req.body,'bodyyy ---- create job');
    
    const response = await hrService.saveJob(req.body)
    console.log(response,'res----createjob');
    
    if(response.message === 'success') res.status(201).json({status : 201,message : 'success'})
    if(response.message === 'failed') res.status(400).json({status : 400,message : 'Creating new Job failed'})

  } catch (error) {
   res.status(500).json({status : 500,message : 'Something Went Wrong,try again'})
  }
}

const getJobs = async (req : Request, res : Response)=>{
  try {
    console.log(11111);
    const hrEmail = req.params.id
    console.log(hrEmail,'email');
    const pageNumber :string | number = req.query.page  as string
    const jobsPerPage :string | number  = req.query.jobsPerPage  as string
console.log(pageNumber,jobsPerPage,'----queries');

    
    const response = await hrService.getJobsData(hrEmail,Number(pageNumber),Number(jobsPerPage))
    // console.log(response,'resoponsejobs');
    
    if(response?.message === '') res.status(201).json({status : 201,jobs : response?.data,totalPages : response?.totalPages})
    if(response?.message === 'No jobs found') res.status(400).json({status : 400,jobs : '',totalPages :null})
    if(response?.message === 'error') res.status(500).json({status : 500,jobs : '',totalPages :null})


  } catch (error) {
    console.log(error,'error happended in fetching jobs');
    
  }
}


export default {
    hrSignup,
    verifyOtp,
    hrLogin,
    createJOb,
    getJobs,
}