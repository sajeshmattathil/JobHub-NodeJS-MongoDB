import User from "../../Model/user";
import Otp from "../../Model/otp";
import Job from "../../Model/job";
import followers from "../../Model/followers";
import plan from "../../Model/plan";
import chat from "../../Model/chat";
import { ObjectId } from "mongodb";
import { UserData, UserInterface } from "../interfaces/IUserInteractors";
import { IUserRepository } from "../interfaces/IUserRepository";
import { injectable } from "inversify";

@injectable()

export class UserRepository implements IUserRepository {
  private userModel: typeof User;
  private otpModel: typeof Otp;
  private jobModel: typeof Job;
  private followerModel: typeof followers;
  private planModel: typeof plan;
  private chatModel: typeof chat;

  constructor() {
    this.userModel = User;
    this.otpModel = Otp;
    this.jobModel = Job;
    this.followerModel = followers;
    this.planModel = plan;
    this.chatModel = chat;
  }

  async findUser(email: string): Promise<UserData | null> {
    try {
      return await this.userModel.findOne({ email: email });
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }

  async getOtp(userId: string): Promise<any> {
    try {
      return await Otp.findOne({ userId: userId });
    } catch (error) {
      console.log("Otp not found in database", error);
      return null;
    }
  }

  async findAndUpdateOtp(data: any): Promise<any> {
    try {
      return await Otp.updateOne(
        { userId: data.userId },
        {
          $set: {
            createdAt: data.createdAt,
            otp: data.otp,
            userId: data.userId,
          },
        }
      );
    } catch (error) {
      console.log("Error in updating otp ");
      return null;
    }
  }

  async setVerifiedTrue(userId: string): Promise<any> {
    try {
      return await this.userModel.updateOne(
        { email: userId },
        { $set: { isVerified: true } }
      );
    } catch (error) {
      console.log("Error in setting user as verified");
      return null;
    }
  }

  async updateUser(data: any, userEmail: string): Promise<any> {
    try {
      console.log(data, "newUserData----");

      await this.userModel.updateOne(
        { email: userEmail },
        {
          $set: {
            fname: data.fname,
            lname: data.lname,
            resume: data.resume,
            experience: data.experience,
            skills: data.skills,
            educationalQualification: data.educationalQualification,
            workExperience: data.workExperience,
          },
        }
      );
      return { message: "success" };
    } catch (error) {
      console.log("error in update user in db", error);
    }
  }

  async getJobs(
    pageNumber: number,
    jobsPerPage: number,
    body: any,
    skills: string[] | []
  ): Promise<any> {
    try {
      let query: any;

      if (body.value.trim()) {
        query = {
          $or: [
            {
              isDeleted: false,
              "salaryPackage.max": { $lte: body.salaryPackage },
              locations: { $in: [new RegExp(body.value, "i")] },
            },
            {
              isDeleted: false,
              "salaryPackage.max": { $lte: body.salaryPackage },
              qualification: { $in: [new RegExp(body.value, "i")] },
            },
            {
              isDeleted: false,
              "salaryPackage.max": { $lte: body.salaryPackage },
              jobType: { $regex: `${body.value}`, $options: "i" },
            },
            {
              isDeleted: false,
              "salaryPackage.max": { $lte: body.salaryPackage },
              jobRole: { $regex: `${body.value}`, $options: "i" },
            },
          ],
        };
      } else if (skills.length) {
        query = { isDeleted: false, qualification: { $in: [...skills] } };
      } else {
        query = { isDeleted: false };
      }

      if (body.industry.length) {
        let orCondition = body.industry.map((item: any) => {
          return { isDeleted: false, industry: item.industry };
        });
        query = { $or: orCondition };
      }
      let sortQuery: any = { createdAt: -1 };
      if (body.sort === "relevance") {
        sortQuery = { createdAt: 1 };
      }
      
      const jobs = await Job.find(query)
        .sort(sortQuery)
        .skip(jobsPerPage * (pageNumber - 1))
        .limit(jobsPerPage);
        
      // if (body.sort === "old") return jobs.reverse();

      return jobs;

    } catch (error) {
      console.error("error in fetching jobs from db for user", error);
      return [];
    }
  }

  async jobCount(body: any, skills: string[] | []): Promise<number> {
    try {
      let query: any;

      if (body.value.trim()) {
        query = {
          $or: [
            {
              isDeleted: false,
              "salaryPackage.max": { $lte: body.salaryPackage },
              locations: { $in: [new RegExp(body.value, "i")] },
            },
            {
              isDeleted: false,
              "salaryPackage.max": { $lte: body.salaryPackage},
                package: {
                  $lte: body.salaryPackage
                },
                qualification: {
                  $in: [new RegExp(body.value, "i")]
                }
              },
              {
                isDeleted: false,
                "salaryPackage.max": {
                  $lte: body.salaryPackage
                },
                jobType: {
                  $regex: `${body.value}`,
                  $options: "i"
                }
              },
              {
                isDeleted: false,
                "salaryPackage.max": {
                  $lte: body.salaryPackage
                },
                jobRole: {
                  $regex: `${body.value}`,
                  $options: "i"
                }
              },
            ],
          };
        } else if (skills.length) {
          query = {
            isDeleted: false,
            qualification: {
              $in: [...skills]
            }
          };
        } else {
          query = {
            isDeleted: false
          };
        }
  
        if (body.industry.length) {
          let orCondition = body.industry.map((item: any) => {
            return {
              isDeleted: false,
              industry: item.industry
            };
          });
          query = {
            $or: orCondition
          };
        }
  
        return await Job.countDocuments(query);
      } catch (error) {
        console.error("error happened in fetching job count in userrepo");
        return 0;
      }
    }
  
    async resetPassword(body: any): Promise<any> {
      try {
        return await this.userModel.updateOne(
          { email: body.email },
          {
            $set: {
              password: body.password,
            },
          }
        );
      } catch (error) {
        console.log("error in resetPassword at repo");
        return null;
      }
    }
  
    async getJobData(id: string): Promise<any> {
      try {
        return await Job.aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: "hrs",
              localField: "hrObjectId",
              foreignField: "_id",
              as: "jobData",
            },
          },
          {
            $lookup: {
              from: "appliedjobs",
              localField: "_id",
              foreignField: "jobId",
              as: "appliedData",
            },
          },
        ]);
      } catch (error) {
        console.log(error, "error in fetching job data at repo");
        return null;
      }
    }
  
    async addUserEmailInJobPost(
      userEmail: string,
      jobId: string
    ): Promise<any> {
      try {
        console.log(userEmail, jobId);
  
        const newAppliedUser = {
          email: userEmail,
          isShortListed: false,
        };
  
        return await Job.updateOne(
          { _id: jobId },
          { $push: { appliedUsers: newAppliedUser } }
        );
      } catch (error) {
        console.log(error, "error in updating user email in job post at repo");
        return null;
      }
    }
  
    async UnfollowHR(hrID: string, userID: string): Promise<any> {
      try {
        return await followers.deleteOne({ hrID: hrID, userID: userID });
      } catch (error) {
        console.log(error, "error in follow and unfollow hr at repo");
        return null;
      }
    }
  
    async getPlans(): Promise<any> {
      try {
        return await plan.find({ isActive: true });
      } catch (error) {
        console.log("Error in getting plans at repo", error);
        return null;
      }
    }
  
    async savePayment(body: any, id: string): Promise<any> {
      try {
        body.startedAt = body.subscribedAt;
        const currentDate = body.subscribedAt;
        const date = new Date(currentDate);
        body.expireAt = date.setDate(date.getDate() + body.duration * 30);
  
        return await User.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              "subscription.isSubscribed": true,
              "subscription.plan": body.planName,
              "subscription.paymentId": body.razorpayId,
              "subscription.amount": body.amount,
              "subscription.startedAt": body.startedAt,
              "subscription.expireAt": body.expireAt,
            },
          }
        );
      } catch (error) {
        console.log("Error in save payment at repo");
        return null;
      }
    }
  
    async addUserToPlan(planId: string, userEmail: string): Promise<any> {
      try {
        console.log(planId, userEmail, ">>>>>");
        return await plan.updateOne(
          { _id: planId },
          { $push: { users: userEmail } }
        );
      } catch (error) {
        console.log("Error in save add user to plan at repo");
        return null;
      }
    }
  
    async getPrevChatUsers(userEmail: string): Promise<any> {
      try {
        return await chat.distinct("recipient1", { recipient2: userEmail });
      } catch (error) {
        console.log(error, "error happende in getting prev chat users in repo");
        return null;
      }
    }
  
    async getLastMsg(
      usersData: (string | undefined | null)[] | undefined,
      userEmail: string
    ): Promise<any> {
      try {
        console.log(usersData, userEmail, "repoooo");
        if (usersData?.length)
          return await chat
            .find({ recipient2: userEmail, recipient1: { $in: usersData } })
            .sort({ time: -1 });
        return;
      } catch (error) {
        console.log(
          error,
          "error happend in getting last msg hrs in repo"
        );
        return null;
      }
    }
  }


