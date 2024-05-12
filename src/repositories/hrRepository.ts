import { jobData } from './../interfaces/IHRRepository';
import { ObjectId } from "mongodb";
import { HrData, IHRRepository, otpData } from "../interfaces/IHRRepository";
import Hr from "../../Model/hr";
import Job from "../../Model/job";
import Otp from "../../Model/otp";
import appliedJobs from "../../Model/appliedJobs";
import chat from "../../Model/chat";
import followers from "../../Model/followers";
import { injectable } from 'inversify';

@injectable()
export class HRRepository implements IHRRepository {
    private HRModel: typeof Hr;
    private jobModel: typeof Job;
    private otpModel: typeof Otp;
    private appliedJobsModel: typeof appliedJobs;
    private chatModel: typeof chat;
    private followersModel: typeof followers;
  
    constructor() {
      this.HRModel = Hr;
      this.jobModel = Job;
      this.otpModel = Otp;
      this.appliedJobsModel = appliedJobs;
      this.followersModel = followers;
      this.chatModel = chat;
    }

    async findHr(email: string): Promise<HrData | null> {
        try {
            return await this.HRModel.findOne({ email: email });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async findHrById(id: string): Promise<HrData | null> {
        try {
            return await this.HRModel.findOne({ _id: id });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getOtp(userId: string): Promise<otpData | null> {
        try {
            return await this.otpModel.findOne({ userId: userId });
        } catch (error) {
            console.error("Otp not found in database", error);
            return null;
        }
    }

    async findAndUpdateOtp(data: otpData): Promise<any> {
        try {
            return await this.otpModel.updateOne(
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
            console.error("Error in updating otp ", error);
            return null;
        }
    }

    async setVerifiedTrue(userId: string): Promise<any> {
        try {
            return await this.HRModel.updateOne(
                { email: userId },
                { $set: { isVerified: true } }
            );
        } catch (error) {
            console.error("Error happened in setting true for user account in repo", error);
            return null;
        }
    }

    async getJobsData(id: ObjectId, pageNumber: number, jobsPerPage: number): Promise<any[]> {
        try {
            return await this.jobModel.find({ hrObjectId: id, isDeleted: false })
                .sort({ createdAt: -1 })
                .skip(jobsPerPage * (pageNumber - 1))
                .limit(jobsPerPage);
        } catch (error) {
            console.error("Error happened in fetching job data in user repo", error);
            return [];
        }
    }

    async jobCount(id: ObjectId): Promise<number> {
        try {
            return await this.jobModel.countDocuments({ hrObjectId: id });
        } catch (error) {
            console.error("Error happened in fetching job count in user repo", error);
            return 0;
        }
    }

    async updateProfile(data: HrData): Promise<{ message: string }> {
        try {
            await this.HRModel.updateOne(
                { email: data.email },
                {
                    $set: {
                        name: data.name,
                        company: data.company,
                        resume: data.resume,
                        experience: data.experience,
                        website: data.website,
                        employeesNumber: data.employeesNumber,
                    },
                }
            );
            return { message: "success" };
        } catch (error) {
            console.error("error in update user in db", error);
            return { message: "failed" };
        }
    }

    async findSelectedJobData(jobId: string): Promise<any> {
        try {
            return await this.appliedJobsModel.aggregate([
                { $match: { jobId: new ObjectId(jobId), isDeleted: false } },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                {
                    $lookup: {
                        from: "jobs",
                        localField: "jobId",
                        foreignField: "_id",
                        as: "jobPostData",
                    },
                },
            ]);
        } catch (error) {
            console.error(error, "error happened in fetching job data at repo");
            return null;
        }
    }

    async deleteJob(jobId: string): Promise<any> {
        try {
            const appliedJobUpdate = await this.appliedJobsModel.updateOne(
                { jobId: jobId },
                { $set: { isDeleted: true } }
            );
            const jobUpdate = await Job.updateOne(
                { _id: jobId },
                { $set: { isDeleted: true } }
            );
            return { appliedJobUpdate, jobUpdate };
        } catch (error) {
            console.error(error, "error happened in deleting job at repo");
        }
    }

    async updateJob(body: jobData): Promise<{ message: string }> {
        try {
            const updateJob = await this.jobModel.updateOne(
                { _id: body.jobId },
                {
                    $set: {
                        description: body.description,
                        qualification: body.qualification,
                        company: body.company,
                        experience: body.experience,
                        salaryScale: body.salaryScale,
                        educationalQualification: body.educationalQualification,
                        industry: body.industry,
                        locations: body.locations,
                    },
                }
            );
            if (updateJob) return { message: "success" };
            else return { message: "failed" };
        } catch (error) {
            console.error(error, "error happened in updating job at repo");
            return { message: "failed" };
        }
    }

    async updateJobpostHRViewed(jobId: string, HRId: string): Promise<any> {
        try {
            return await this.appliedJobsModel.updateOne(
                { jobId: jobId, hrId: HRId },
                { $set: { isHRViewed: true } }
            );
        } catch (error) {
            console.error(error, "error happened in updating job hr viewed at repo");
        }
    }

    async updateIsShortListed(jobId: string, userId: string): Promise<any> {
        try {
            return await this.jobModel.updateOne(
                { _id: jobId, "appliedUsers.email": userId },
                {
                    $set: { "appliedUsers.$.isShortListed": true },
                }
            );
        } catch (error) {
            console.error(error, "error happened in shortlisting")
        }
    }

            async getShortListedUsers(jobId: string): Promise<any> {
                try {
                    return await this.jobModel.aggregate([
                        {
                            $match: {
                                _id: new ObjectId(jobId),
                                "appliedUsers.isShortListed": true,
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                foreignField: "email",
                                localField: "appliedUsers.email",
                                as: "shortListedUsers",
                            },
                        },
                        {
                            $unwind: "$shortListedUsers",
                        },
                    ]);
                } catch (error) {
                    console.error(error, "error happened in getting shortlisted user at repo");
                }
            }
            
            async removeFromShortListed(email: string, jobId: string): Promise<any> {
                try {
                    return await this.jobModel.updateOne(
                        { _id: jobId, "appliedUsers.email": email },
                        {
                            $set: { "appliedUsers.$.isShortListed": false },
                        }
                    );
                } catch (error) {
                    console.error(error, "error happened in getting remove from shortlisted user at repo");
                }
            }
            
            async getPrevChatUsers(HREmail: string): Promise<any> {
                try {
                    return await this.chatModel.distinct("recipient2", { recipient1: HREmail });
                } catch (error) {
                    console.error(error, "error happende in getting prev chat users in repo");
                }
            }
            
            async getLastMsg(usersData: (string | null | undefined)[] | undefined, HREmail: string): Promise<any> {
                try {
                    if (usersData)
                        return await this.chatModel
                            .find({ recipient1: HREmail, recipient2: { $in: [...usersData] } })
                            .sort({ time: -1 });
                } catch (error) {
                    console.error(error, "error happend in getting last msg users in repo");
                }
            }
            
            async getFollowersData(HRId: string): Promise<any> {
                try {
                    return await this.followersModel.aggregate([
                        {
                            $match: { hrID: new ObjectId(HRId), isBlocked: false },
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "userID",
                                foreignField: "_id",
                                as: "users",
                            },
                        },
                        {
                            $unwind: "$users",
                        },
                        {
                            $project: {
                                _id: 0,
                                'users._id': 1,
                                'users.fname': 1,
                                'users.lname': 1,
                                'users.resume': 1
                            },
                        },
                    ]);
                } catch (error) {
                    console.error(error, "error happened in fetching followers data in repo");
                    return null;
                }
            }
        }