import { ObjectId } from "mongodb";
import { UserData,ReqBody,Data } from "./IUserInteractors";

export interface IUserRepository {
  findUser(email: string): Promise<UserData | null>;
  getOtp(userId: string): Promise<any>;
  findAndUpdateOtp(data: any): Promise<any>;
  setVerifiedTrue(userId: string): Promise<any>;
  updateUser(data: any, userEmail: string): Promise<any>;
  getJobs(pageNumber: number, jobsPerPage: number, body: any, skills: string[] | []): Promise<any>;
  jobCount(body: any, skills: string[] | []): Promise<number>;
  resetPassword(body: ReqBody) : Promise<Data>;
  getJobData(id: string): Promise<any>;
  addUserEmailInJobPost(userEmail: string, jobId: string | ObjectId): Promise<any>;
  UnfollowHR(hrID: string, userID: string): Promise<any>;
  getPlans(): Promise<any>;
  savePayment(body: any, id: string): Promise<any>;
  addUserToPlan(planId: string, userEmail: string): Promise<any>;
  getPrevChatUsers(userEmail: string): Promise<any>;
  getLastMsg(usersData: (string | undefined | null)[] | undefined, userEmail: string): Promise<any>;
}
