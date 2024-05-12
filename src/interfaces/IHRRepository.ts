import { ObjectId } from "mongodb";


export interface HrData {
    _id: ObjectId;
    employeesNumber: any;
    experience: any;
    name: string;
    email: string;
    password: string;
    resume: string;
    company: string;
    website: string;
  }
export interface otpData {
    userId: string;
    otp: string;
    createdAt: Date;
  }

  export interface jobData {
    salaryPackage: { min: number; max: number; };
    hrObjectId: any;
    createdBy: string;
    jobId?: ObjectId | undefined;
    jobRole: string;
    description: string;
    qualification: string[];
    salaryFrom: string;
    salaryTo: string;
    company: string;
    experience: string;
    salaryScale: string;
    educationalQualification: string;
    education: string;
    course: string;
    industry: string;
    locations: String[];
  }


export interface bodyData {
    name: string;
    company: string;
    website: string;
    resume: string;
    employeesNumber: number;
    experience: number;
    email: string;
  }
export interface IHRRepository {
  findHr(email: string): Promise<HrData | null>;
  findHrById(id: string): Promise<HrData | null>;
  getOtp(userId: string): Promise<otpData | null>;
  findAndUpdateOtp(data: otpData): Promise<any>;
  setVerifiedTrue(userId: string): Promise<any>;
  getJobsData(id: ObjectId, pageNumber: number, jobsPerPage: number): Promise<any[]>;
  jobCount(id: ObjectId): Promise<number>;
  updateProfile(data: HrData): Promise<{ message: string }>;
  findSelectedJobData(jobId: string): Promise<any>;
  deleteJob(jobId: string): Promise<any>;
  updateJob(data: jobData): Promise<{ message: string }>;
  updateJobpostHRViewed(jobId: string, HRId: string): Promise<any>;
  updateIsShortListed(jobId: string, userId: string): Promise<any>;
  getShortListedUsers(jobId: string): Promise<any>;
  removeFromShortListed(email: string, jobId: string): Promise<any>;
  getPrevChatUsers(HREmail: string): Promise<any>;
  getLastMsg(usersData: (string | undefined | null)[] | undefined, HREmail: string): Promise<any>;
  getFollowersData(HRId: string): Promise<any>;
}