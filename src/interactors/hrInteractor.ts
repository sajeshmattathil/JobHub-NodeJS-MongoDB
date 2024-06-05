import { IHRInteractor } from "../interfaces/IHRInteractor";
import { HrData, otpData, jobData } from "../interfaces/IHRRepository";
import { otp } from "../interfaces/IUserInteractors";
import Hr from "../../Model/hr";
import Job from "../../Model/job";
import Otp from "../../Model/otp";
import bcrypt from "bcrypt";
import { HRRepository } from "../repositories/hrRepository";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../Utils";

@injectable()
export class HRInteractor implements IHRInteractor {
  private repository: HRRepository;

  constructor(@inject(INTERFACE_TYPE.HRRepository) repository: HRRepository) {
    this.repository = repository;
  }

  async saveHrData(
    data: HrData
  ): Promise<{ status: number; message?: string | undefined }> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 5);
      data.password = hashedPassword;
      const checkExistingHr = await this.repository.findHr(data.email);
      if (checkExistingHr) return { status: 200, message: "exists" };
      const hrData = new Hr(data);
      await hrData.save();
      return { status: 201 };
    } catch (error) {
      return { status: 500 };
    }
  }

  async saveOtp(data: otpData): Promise<void> {
    try {
      const checkUserExists = await this.repository.getOtp(data.userId);
      if (checkUserExists) {
        await this.repository.findAndUpdateOtp(data);
      } else {
        await Otp.create(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getSavedOtp(
    userID: string
  ): Promise<void | { status: number; data?: otpData | null }> {
    try {
      const getOtp = await this.repository.getOtp(userID);
      if (getOtp) return { status: 200, data: getOtp };
    } catch (error) {
      console.log("Otp not found");
      return;
    }
  }

  async setVerifiedTrue(userId: string): Promise<{ status: number }> {
    try {
      await this.repository.setVerifiedTrue(userId);
      return { status: 200 };
    } catch (error) {
      return { status: 500 };
    }
  }

  async verifyHrData(data: HrData): Promise<{ message: string; data: any }> {
    try {
      const verifyHrData = await this.repository.findHr(data.email);
      if (verifyHrData) {
        const decryptedPassword = await bcrypt.compare(
          data.password,
          verifyHrData.password
        );
        if (decryptedPassword)
          return { message: "verified", data: verifyHrData };
        else return { message: "declined", data: null };
      } else return { message: "no user found", data: null };
    } catch (error) {
      return { message: "", data: null };
    }
  }

  async saveJob(data: jobData): Promise<{ message: string }> {
    try {
      const hrObjectId = await this.repository.findHr(data.createdBy);
      if (hrObjectId) data.hrObjectId = hrObjectId._id;
      data.salaryPackage = {
        min: Number(data.salaryScale[0] + data.salaryScale[1]) * 100000,
        max: Number(data.salaryScale[3] + data.salaryScale[4]) * 100000,
      };
      const job = new Job(data);
      await job.save();
      return { message: "success" };
    } catch (error) {
      console.error(error);
      return { message: "failed" };
    }
  }

  async getJobsData(
    hrEmail: string,
    pageNumber: number,
    jobsPerPage: number
  ): Promise<{
    data: any[] | null;
    totalPages: number | null;
    message: string;
  }> {
    try {
      const hrData = await this.repository.findHr(hrEmail);
      if (hrData !== null && Object.keys(hrData).length) {
        const getJobsData = await this.repository.getJobsData(
          hrData._id,
          pageNumber,
          jobsPerPage
        );
        const jobCount = await this.repository.jobCount(hrData._id);
        if (getJobsData !== undefined && getJobsData) {
          if (getJobsData.length)
            return { data: getJobsData, totalPages: jobCount, message: "" };
          else
            return { data: null, totalPages: null, message: "No jobs found" };
        }
      }
      return { data: null, totalPages: null, message: "No jobs found" };
    } catch (error) {
      return { data: [], totalPages: null, message: "error" };
    }
  }

  async getHR(id: string): Promise<{ data: any; message: string }> {
    try {
      const getHR = await this.repository.findHr(id);
      if (getHR && getHR.password !== undefined) {
        getHR.password = "";
        return {
          data: getHR,
          message: "success",
        };
      } else
        return {
          data: null,
          message: "Not found",
        };
    } catch (error) {
      return {
        data: null,
        message: "error",
      };
    }
  }

  async updateProfile(HRData: any): Promise<{ message: string }> {
    try {
      const updateUser = await this.repository.updateProfile(HRData);
      if (updateUser?.message) return { message: "success" };
      else return { message: "failed" };
    } catch (error) {
      console.log("error in updating profile at userservice");
      return { message: "failed" };
    }
  }

  async getJobDetails(jobId: string): Promise<{ message: string; data: any }> {
    try {
      const getData: any = await this.repository.findSelectedJobData(jobId);
      if (getData && getData.length)
        return { message: "success", data: getData };
      else return { message: "failed", data: null };
    } catch (error) {
      console.log(error, "error happened in fetching job data at hr service");
      return { message: "failed", data: null };
    }
  }

  async deleteJob(jobId: string): Promise<{ message: string }> {
    try {
      const deleteJobData = await this.repository.deleteJob(jobId);
      console.log(deleteJobData, "deletjondata----");
      return { message: "success" };
    } catch (error) {
      console.log(error, "error happened in deleting job in hr service");
      return { message: "failed" };
    }
  }

  async updateJob(body: jobData): Promise<{ message: string }> {
    try {
      const updatedResult = await this.repository.updateJob(body);
      console.log(updatedResult, "result-----");
      if (updatedResult.message == "success") return { message: "success" };
      else return { message: "failed" };
    } catch (error) {
      console.log(error, "error happened in updating job in hr service");
      return { message: "failed" };
    }
  }

  async updateJobpostHRViewed(
    jobId: string,
    HRId: string
  ): Promise<{ message: string }> {
    try {
      const updateHRViewed = await this.repository.updateJobpostHRViewed(
        jobId,
        HRId
      );
      console.log(updateHRViewed, "updtate job service");
      return { message: "success" };
    } catch (error) {
      console.log(
        error,
        "error happened in updating job hr viewed in hr service"
      );
      return { message: "failed" };
    }
  }

  async shortListUser(
    jobId: string,
    userId: string
  ): Promise<{ message: string }> {
    try {
      const updateShortListedTrue = await this.repository.updateIsShortListed(
        jobId,
        userId
      );
      console.log(updateShortListedTrue, "updateShortListedTrue");

      if (updateShortListedTrue) return { message: "success" };
      else return { message: "failed" };
    } catch (error) {
      console.log(error, "error happened in shortlist user in hr service");
      return { message: "failed" };
    }
  }

  async getShortListedUsers(
    jobId: string
  ): Promise<{ message: string; data: any[] | null }> {
    try {
      const shortListedData = await this.repository.getShortListedUsers(jobId);
      console.log(shortListedData, "shortListedData");
      if (shortListedData && shortListedData.length)
        return { message: "success", data: shortListedData };
      else return { message: "failed", data: null };
    } catch (error) {
      console.log(
        error,
        "error happened in gettind shortlist user in hr service"
      );
      return { message: "failed", data: null };
    }
  }

  async removeFromShortListed(body: {
    email: string;
    jobId: string;
  }): Promise<boolean> {
    try {
      const removedData = await this.repository.removeFromShortListed(
        body.email,
        body.jobId
      );
      if (removedData?.modifiedCount && removedData?.modifiedCount > 0)
        return true;
      else return false;
    } catch (error) {
      console.log(
        error,
        "error happened in gettind shortlist user in hr service"
      );
      return false;
    }
  }

  async getPrevChatUsers(
    HREmail: string
  ): Promise<{
    success: boolean;
    data:
      | { text: string | null | undefined; name: string | null | undefined }[]
      | null;
  }> {
    try {
      const usersData = await this.repository.getPrevChatUsers(HREmail);
      console.log(usersData, "users docs");
      const lastChat = await this.repository.getLastMsg(usersData, HREmail);

      interface resultInterface {
        text: string | null | undefined;
        name: string | null | undefined;
      }
      let result: resultInterface[] | null = [];
      if (usersData && lastChat) {
        for (let user of usersData) {
          let time = Date.now();
          for (let chat of lastChat) {
            if (chat.recipient2 === user) {
              result.push({ text: chat.text, name: chat.recipient2 });
              break;
            }
          }
        }
      }
      if (usersData && usersData.length && result)
        return { success: true, data: result };
      else return { success: false, data: null };
    } catch (error) {
      return { success: false, data: null };
    }
  }

  async getFollowersData(
    HRId: string
  ): Promise<{ status: number; data?: any[]; message?: string }> {
    try {
      const getFollowersData = await this.repository.getFollowersData(HRId);
      if (getFollowersData && getFollowersData.length)
        return { status: 201, data: getFollowersData };
      else return { status: 400, message: "No data found" };
    } catch (error) {
      return { status: 500, message: "Internal server error" };
    }
  }
}
