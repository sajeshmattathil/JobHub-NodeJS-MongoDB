import User from "../../Model/user";
import bcrypt from "bcrypt";
import {
  IUserInteractors,
  UserInterface,
  otp,
  Data,
  ReqBody,
  UserData,
  SearchBody,
  // AppliedJobBody,
  PaymentBody,
  ResultInterface,
  AppliedJobsInterface,
} from "../interfaces/IUserInteractors";
import { IUserRepository } from "../interfaces/IUserRepository";
import Otp from "../../Model/otp";
import appliedJobs from "../../Model/appliedJobs";
import transaction from "../../Model/transactions";
import followers from "../../Model/followers";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../Utils";

@injectable()
export class UserInteractor implements IUserInteractors {
  private repository: IUserRepository;

  constructor(
    @inject(INTERFACE_TYPE.UserRepository) repository: IUserRepository
  ) {
    this.repository = repository;
  }

  async createNewUser(user: UserInterface): Promise<Data> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 5);
      user.password = hashedPassword;

      const checkExistingUsers = await this.repository.findUser(user.email);

      if (checkExistingUsers?.isVerified) return { status: 409 };
      if (checkExistingUsers?.isVerified === false) return { status: 201 };

      const newUser = new User(user);
      await newUser.save();

      return { status: 201 };
    } catch (error) {
      console.error(error);
      return { status: 500 };
    }
  }

  async saveOtp(data: otp): Promise<Data> {
    try {
      const checkUserExists = await this.repository.getOtp(data.userId);
      if (checkUserExists?.userId) {
        const updateOTP = await this.repository.findAndUpdateOtp(data);
        if (updateOTP) return { status: 201 };
      } else {
        const saveOtp = await Otp.create(data);
        return { status: 201 };
      }

      return { status: 406 };
    } catch (error) {
      console.error(error, "error saving otp");
      return { status: 500 };
    }
  }

  async getSavedOtp(userID: string): Promise<Data | null> {
    try {
      const getOtp = await this.repository.getOtp(userID);
      if (getOtp) return getOtp;
      else return null;
    } catch (error) {
      console.error("Otp not found");
      return null;
    }
  }

  async verifyLoginUser(user: ReqBody): Promise<Data> {
    try {
      const userDetails: UserData | null = await this.repository.findUser(
        user.email
      );

      if (userDetails !== undefined && userDetails !== null) {
        const comparePsw = await bcrypt.compare(
          user.password,
          userDetails.password
        );

        if (userDetails && comparePsw && !userDetails.isBlocked) {
          return {
            userData: userDetails.email,
            status: 201,
            ObjectId: userDetails?._id,
          };
        } else
          return {
            userData: null,
            status: 400,
            message: "Password is incorrect",
          };
      } else {
        return {
          userData: null,
          status: 500,
          message: "No user is found in this email",
        };
      }
    } catch (error) {
      console.error(error);
      return { userData: null, message: "Something went wrong " };
    }
  }

  async setVerifiedTrue(userId: string): Promise<Data> {
    try {
      const setVerifiedTrue = await this.repository.setVerifiedTrue(userId);
      return { status: 200 };
    } catch (error) {
      console.error(error, "error in set verified true at user service");
      return { status: 500 };
    }
  }

  async getUser(id: string): Promise<Data> {
    try {
      const getUser = await this.repository.findUser(id);
      if (getUser)
        return {
          data: getUser,
          status: 200,
        };
      else
        return {
          data: null,
          status: 400,
        };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        status: 500,
      };
    }
  }

  async updateUser(data: UserData, userEmail: string): Promise<Data> {
    try {
      const updateUser = await this.repository.updateUser(data, userEmail);

      if (updateUser?.message) return { status: 201 };
      else return { status: 400 };
    } catch (error) {
      console.error(error);
      return { status: 400 };
    }
  }

  async getJobs(
    pageNumber: number,
    jobsPerPage: number,
    body: SearchBody,
    userEmail: string
  ): Promise<Data> {
    try {
      let getUser;
      if (userEmail.trim()) getUser = await this.repository.findUser(userEmail);
      const jobCount = await this.repository.jobCount(
        body,
        getUser?.skills ? getUser.skills : []
      );

      const getJobs = await this.repository.getJobs(
        pageNumber,
        jobsPerPage,
        body,
        getUser?.skills ? getUser.skills : []
      );
      if (getJobs !== undefined) {
        if (getJobs.length)
          return { data: getJobs, totalPages: jobCount, status: 201 };
        else return { data: null, status: 400 };
      } else return { data: null, totalPages: null, status: 500 };
    } catch (error) {
      console.error(error);
      return { data: null, totalPages: null, status: 500 };
    }
  }
  async checkUserExists(userId: string): Promise<Data> {
    try {
      const findUser = await this.repository.findUser(userId);
      if (findUser !== undefined) {
        if (findUser !== null) {
          if (findUser.email) {
            return { status: 200 };
          } else {
            return { status: 404 };
          }
        }
      }
      return { status: 404 };
    } catch (error) {
      console.error(error);
      return { status: 500 };
    }
  }

  async resetPassword(body: ReqBody): Promise<Data> {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 15);
      body.password = hashedPassword;
      const resetPassword = await this.repository.resetPassword(body);
      return { status: 201 };
    } catch (error) {
      console.error(error);
      return { status: 500 };
    }
  }

  async getJobData(id: string): Promise<Data> {
    try {
      const data = await this.repository.getJobData(id);
      if (data && data.length) {
        return { status: 201, data: data };
      } else {
        return {
          status: 404,
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        data: null,
      };
    }
  }

  async saveAppliedJob(body: AppliedJobsInterface): Promise<Data> {
    try {
      if (body.userEmail !== undefined && body.jobId !== undefined) {
        const newJob = new appliedJobs(body);
        newJob.save();
        await this.repository.addUserEmailInJobPost(body.userEmail, body.jobId);

        // if (newJob) return { status: 201, data: newJob };
        if (newJob) return { status: 201 };
      }
      return { status: 401 };
    } catch (error) {
      console.error(error, "error happened in saving applied jobs at service");
      return { status: 500, appliedJob: null };
    }
  }

  async followAndUnfollow(
    hrID: string,
    value: string,
    userID: string
  ): Promise<Data> {
    try {
      if (value == "follow+") {
        const newFollower = new followers({ hrID, userID });
        newFollower.save();
      } else {
        await this.repository.UnfollowHR(hrID, userID);
      }
      return { status: 200 };
    } catch (error) {
      console.error(error, "error in follow and unfollow hr at service");
      return { status: 500 };
    }
  }

  async getPlans(): Promise<Data> {
    try {
      const getPlanDatas = await this.repository.getPlans();
      if (getPlanDatas && getPlanDatas.length) {
        return {
          status: 201,
          data: getPlanDatas,
        };
      } else {
        return {
          status: 400,
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        data: null,
      };
    }
  }

  async savePayment(
    body: PaymentBody,
    id: string,
    userEmail: string
  ): Promise<Data> {
    try {
      await this.repository.addUserToPlan(body.planId, userEmail);
      const updatePayment = await this.repository.savePayment(body, id);
      body.time = body.startedAt;
      const newTransaction = new transaction(body);
      newTransaction.save();
      if (
        updatePayment &&
        updatePayment.modifiedCount !== 0 &&
        newTransaction?._id
      )
        return { status: 200 };
      else return { status: 400 };
    } catch (error) {
      console.error(error);
      return { status: 500 };
    }
  }

  async getPrevChatUsers(userEmail: string): Promise<Data> {
    try {
      const usersData = await this.repository.getPrevChatUsers(userEmail);
      const lastChat = await this.repository.getLastMsg(usersData, userEmail);
      let result: ResultInterface[] | null = [];
      if (usersData && lastChat) {
        for (let user of usersData) {
          for (let chat of lastChat) {
            if (chat.recipient1 === user) {
              result.push({ text: chat.text, name: chat.recipient1 });
              break;
            }
          }
        }
      }
      if (usersData && usersData.length && result)
        return { status: 201, data: result };
      else return { status: 404, data: null };
    } catch (error) {
      console.error(error);
      return { status: 500, data: null };
    }
  }
}
