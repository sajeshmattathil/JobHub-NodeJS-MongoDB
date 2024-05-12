import { HrData, jobData, otpData } from "./IHRRepository";
import { otp } from "./IUserInteractors";

export interface IHRInteractor {
    saveHrData(data: HrData): Promise<{ status: number, message?: string }>;
    saveOtp(data: otpData): Promise<void>;
    getSavedOtp(userID: string): Promise<{ status: number, data?: otp | null } | void>;
    setVerifiedTrue(userId: string): Promise<{ status: number }>;
    verifyHrData(data: HrData): Promise<{ message: string, data: any }>;
    saveJob(data: jobData): Promise<{ message: string }>;
    getJobsData(hrEmail: string, pageNumber: number, jobsPerPage: number): Promise<{ data: any[] | null, totalPages: number | null, message: string }>;
    getHR(id: string): Promise<{ data: any | null, message: string }>;
    updateProfile(HRData: any): Promise<{ message: string }>;
    getJobDetails(jobId: string): Promise<{ message: string, data: any | null }>;
    deleteJob(jobId: string): Promise<{ message: string }>;
    updateJob(body: jobData): Promise<{ message: string }>;
    updateJobpostHRViewed(jobId: string, HRId: string): Promise<{ message: string }>;
    shortListUser(jobId: string, userId: string): Promise<{ message: string }>;
    getShortListedUsers(jobId: string): Promise<{ message: string, data: any[] | null }>;
    removeFromShortListed(body: { email: string, jobId: string }): Promise<boolean>;
    getPrevChatUsers(HREmail: string): Promise<{ success: boolean, data: { text: string | null | undefined, name: string | null | undefined }[] | null }>;
    getFollowersData(HRId: string): Promise<{ status: number, data?: any[], message?: string }>;
}