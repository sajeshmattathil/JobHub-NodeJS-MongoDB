import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { IAdminInteractor, loginBody } from './../interfaces/IAdminInteractor';
import { IAdminRepository, updatedPlan } from "../interfaces/IAdminRepository";
import plan from "../../Model/plan";
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from "../../Utils";

@injectable()
export class AdminInteractor implements IAdminInteractor{
    private repository: IAdminRepository;

    constructor(@inject(INTERFACE_TYPE.AdminRepository)repository: IAdminRepository) {
      this.repository = repository;
    }

    async verifyLoginAdmin(body: loginBody): Promise<{ adminData: any | null; status: number }> {
        try {
            const adminDetails = await this.repository.findAdmin(body.email);

            if (adminDetails) {
                const comparePsw = await bcrypt.compare(body.password, adminDetails.password);
                if (comparePsw)
                    return { adminData: adminDetails.email, status: 201 };
                else return { adminData: null, status: 401 };
            } else {
                return { adminData: null, status: 404 };
            }
        } catch (error) {
            console.log(error);
            return { adminData: null, status: 500 };
        }
    }

    async getAllUsers(): Promise<{ data: any[] | null; status: number }> {
        try {
            const getAllUsers = await this.repository.getAllUsers();
            if (getAllUsers?.length) {
                return { status: 201, data: getAllUsers };
            } else {
                return { status: 404, data: null };
            }
        } catch (error) {
            return { status: 500, data: null };
        }
    }

    async blockUblockUser(email: string, isBlocked: boolean): Promise<{ status: number }> {
        try {
            const blockUblockUser = await this.repository.blockUblockUser(email, isBlocked);
            if (blockUblockUser) return { status: 201 };
            else return { status: 404 };
        } catch (error) {
            console.log("Error in block n unblock", error);
            return { status: 500 };
        }
    }

    async getHiringManagers(pageNumber: number, HRsPerPage: number): Promise<{ data: any[] | null; totalPages: number | null; status: number }> {
        try {
            const HRCount = await this.repository.HRCount();
            const getHiringManagers = await this.repository.getHiringManagers(pageNumber, HRsPerPage);
            if (getHiringManagers !== undefined) {
                if (getHiringManagers.length)
                    return { status: 201, data: getHiringManagers, totalPages: HRCount };
            } else {
                return { status: 404, data: null, totalPages: null };
            }
            return { status: 400, data: null, totalPages: null };
        } catch (error) {
            return { status: 500, data: null, totalPages: null };
        }
    }

    async getHiringManagersApproved(pageNumber: number, HRsPerPage: number): Promise<{ data: any[] | null; totalPages: number | null; status: number }> {
        try {
            const HRCount = await this.repository.HRCountApproved();
            const getHiringManagers = await this.repository.getHiringManagersApproved(pageNumber, HRsPerPage);
            if (getHiringManagers !== undefined) {
                if (getHiringManagers.length)
                    return { status: 201, data: getHiringManagers, totalPages: HRCount };
            } else {
                return { status: 404, data: null, totalPages: null };
            }
            return { status: 400, data: null, totalPages: null}
        } catch (error) {
            return { status: 500, data: null, totalPages: null };
        }
    }

    async blockUnblockHR(email: string, isBlocked: boolean): Promise<{ status: number }> {
        try {
            const blockUblockHR = await this.repository.blockUblockHR(email, isBlocked);
            if (blockUblockHR) return { status: 201 };
            else return { status: 404 };
        } catch (error) {
            return { status: 500 };
        }
    }

    async hrApprove(email: string): Promise<{ status: number }> {
        try {
            const hrApprove = await this.repository.hrApprove(email);
            if (hrApprove) return { status: 201 };
            else return { status: 404 };
        } catch (error) {
            return { status: 500 };
        }
    }

    async getAdmin(id: string): Promise<{ data: any | null; status: number }> {
        try {
            const adminData = await this.repository.findAdmin(id);
            if (adminData && adminData?.password !== undefined) {
                adminData.password = "";
                return { data: adminData, status: 201 };
            } else
                return { data: null, status: 404 };
        } catch (error) {
            return { data: null, status: 500 };
        }
    }

    async saveNewPlan(body: any): Promise<{ status: number }> {
        try {
            const newPlan = new plan(body);
            await newPlan.save();
            if (newPlan) return { status: 200 };
            else return { status: 400 };
        } catch (error) {
            return { status: 500 };
        }
    }

    async getPlans(): Promise<{ data: any[] | null; status: number }> {
        try {
            const getPlanDatas = await this.repository.getPlans();
            if (getPlanDatas && getPlanDatas.length) {
                return { status: 201, data: getPlanDatas };
            } else {
                return { status: 404, data: null };
            }
        } catch (error) {
            return { status: 500, data: null };
        }
    }

    async getPlanData(planId: string): Promise<{ data: any | null; status: number }> {
        try {
            const getPlanData = await this.repository.getPlanData(planId);
            if (getPlanData && Object.keys(getPlanData).length) {
                return { status: 201, data: getPlanData };
            } else
                return { status: 400, data: null };
        } catch (error) {
            return { status: 500, data: null };
        }
    }

    async updatePlan(planId: string, body: updatedPlan): Promise<{ status: number }> {
        try {
            const getUpdatedData = await this.repository.updatePlan(planId, body);
            if (getUpdatedData) {
                return { status: 201 };
            } else
                return { status: 400 };
        } catch (error) {
            return { status: 500 };
        }
    }

    async deletePlan(id: string): Promise<{ status: number }> {
        try {
            const getDeletedData = await this.repository.deletePlan(id);
            if (getDeletedData) {
                return { status: 201 };
            } else
                return { status: 400 };
        } catch (error) {
            return { status: 500 };
        }
    }

    async getAllDashboardData(): Promise<{ data: any | null; error?: string; status: number }> {
        try {
            const [
                totalNumberOfUsers,
                totalNumberOfHR,
                totalActiveSubscribers,
                totalRevenueGenerated,
            ] = await Promise.all([
                this.repository.findUsersTotal(),
                this.repository.findHRTotal(),
                this.repository.findTotalActiveSubcribers(),
                this.repository.findTotalRevenueGenerated(),
            ]);

            if (
                totalNumberOfUsers !== null &&
                totalNumberOfHR !== null &&
                totalActiveSubscribers !== null &&
                totalRevenueGenerated !== null
            ) {
                return {
                    status: 202,
                    data: {
                        totalUsers: totalNumberOfUsers,
                        totalHR: totalNumberOfHR,
                        activeSubscribers: totalActiveSubscribers,
                        totalRevenue: totalRevenueGenerated[0].totalAmount,
                    },
                };
            } else {
                return {
                    status: 404,
                    error: "Some data could not be retrieved",
                    data:null
                };
            }
        } catch (error) {
            return {
                status: 500,
                error: "An error occurred while fetching data",
                data : null
            };
        }
    }
}
