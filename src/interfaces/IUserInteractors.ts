import { ObjectId } from "mongodb";

export interface IUserInteractors {
  createNewUser(user: UserInterface): Promise<Data>;
  saveOtp(data: otp): Promise<Data>;
  createNewUser(user: UserInterface): Promise<Data>;
  saveOtp(data: OTP): Promise<Data>;
  getSavedOtp(userID: string): Promise<Data | null>;
  verifyLoginUser(user: ReqBody): Promise<Data>;
  setVerifiedTrue(userId: string): Promise<Data>;
  getUser(id: string): Promise<Data>;
  updateUser(data: UserData, userEmail: string): Promise<Data>;
  getJobs(
    pageNumber: number,
    jobsPerPage: number,
    body: SearchBody,
    userEmail: string
  ): Promise<Data>;
  checkUserExists(userId: string): Promise<Data>;
  resetPassword(body: ReqBody): Promise<Data>;
  getJobData(id: string): Promise<Data>;
  saveAppliedJob(body: AppliedJobsInterface ): Promise<Data>;
  followAndUnfollow(hrID: string, value: string, userID: string): Promise<Data>;
  getPlans(): Promise<Data>;
  savePayment(body: PaymentBody, id: string, userEmail: string): Promise<Data>;
  getPrevChatUsers(userEmail: string): Promise<Data>;
}

export interface UserInterface {
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirm: string;
  isVerified: boolean;
}
export interface Data {
  message?: string;
  ObjectId?: ObjectId | string;
  otp?: string;
  createdAt?: string | number | Date;
  status?: number;
data?: null | UserInterface | ResultInterface[] | UserData | AppliedJobsInterface | undefined ;
  totalPages?: null | number;
  userData?: string | null;
  skills?: [string];
  appliedJob?: AppliedJobsInterface | null;
}
export interface otp {
  userId: string;
  otp: string;
  createdAt: Date;
}
export interface AppliedJobsInterface {
  hrId?: ObjectId | string;
  userId?: ObjectId | string;
  jobId?: ObjectId | string;
  appliedAt?: Date;
  isDeleted?: boolean;
  isHRViewed?: boolean;
  isShortlisted?: boolean;
  isReplayed?: boolean;
  userEmail?: string;
}
export interface appliedJobBody {
  jobId?: string;
  hrId?: string;
  appliedAt?: Date;
  userId?: string;
  userEmail?: string;
}
export interface ReqBody {
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirm: string;
}

export interface UserDetailsInterface {
  _id: ObjectId;
  email: string;
  password: string;
  isBlocked: boolean;
}

export interface OTP {
  userId: string;
  otp: string;
  createdAt: Date;
}

export interface ExperienceInterface {
  role: string;
  company: string;
  from: Date;
  to: Date;
}

export interface UserData {
  workExperience: ExperienceInterface[];
  email: string;
  fname: string;
  lname: string;
  resume: string;
  experience: string;
  skills: string[];
  educationalQualification: string;
  password: string;
  isBlocked: boolean;
  _id: string;
  isVerified: boolean;
}

export interface IndustryInterface {
  industry: string;
}

export interface SearchBody {
  industry: IndustryInterface[] | [];
  option: string;
  value: string;
  sort: string;
  salaryPackage: number;
}

export interface AppliedJobBody {
  jobId: string;
  hrId: string;
  appliedAt: Date;
  userId?: string;
  userEmail: string;
}

export interface PaymentBody {
  planId: string;
  planName: string;
  amount: string;
  duration: number;
  subscribedAt: Date;
  expireAt: Date;
  startedAt: Date;
  razorpayId: string;
  time?: Date;
}

export interface ResultInterface {
  text: string | null | undefined;
  name: string | null | undefined;
}
