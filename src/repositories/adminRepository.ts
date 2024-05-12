import { IAdminRepository, updatedPlan } from "../interfaces/IAdminRepository";
import { ObjectId } from "mongodb";
import AdminModel from "../../Model/admin";
import HrModel from "../../Model/hr";
import PlanModel from "../../Model/plan";
import UserModel from "../../Model/user";
import TransactionModel from "../../Model/transactions";
import { injectable } from 'inversify';

@injectable()
export class AdminRepository implements IAdminRepository {
    private adminModel: typeof AdminModel;
    private hrModel: typeof HrModel;
    private planModel: typeof PlanModel;
    private userModel: typeof UserModel;
    private transactionModel: typeof TransactionModel;
  
    constructor() {
        this.userModel = UserModel;
        this.adminModel = AdminModel;
        this.hrModel = HrModel;
        this.transactionModel = TransactionModel;
        this.planModel = PlanModel;
    }

    async findAdmin(email: string): Promise<any> {
        try {
            const adminData = await this.adminModel.findOne({ email: email });
            return adminData;
        } catch (error) {
            console.error("Error finding admin:", error);
return null       
 }
    }

    async getAllUsers(): Promise<any[]> {
        try {
            return await this.userModel.find({ isVerified: true });
        } catch (error) {
            console.error("Error getting all users:", error);
return []        }
    }

    async blockUblockUser(email: string, isBlocked: boolean): Promise<any> {
        try {
            return await this.userModel.updateOne(
                { email: email },
                { $set: { isBlocked: !isBlocked } }
            );
        } catch (error) {
            console.error("Error blocking/unblocking user:", error);
return null        }
    }

    async getHiringManagers(pageNumber: number, HRsPerPage: number): Promise<any[]> {
        try {
            return await this.hrModel.find({ isApproved: false })
                .skip(HRsPerPage * (pageNumber - 1))
                .limit(HRsPerPage);
        } catch (error) {
            console.error("Error getting hiring managers:", error);
            return [] 
        }
    }

    async HRCount(): Promise<number | null> {
        try {
            return await this.hrModel.countDocuments({ isApproved: false });
        } catch (error) {
            console.error("Error getting HR count:", error);
            return null 
        }
    }

    async getHiringManagersApproved(pageNumber: number, HRsPerPage: number): Promise<any[]> {
        try {
            return await this.hrModel.find({ isApproved: true })
                .skip(HRsPerPage * (pageNumber - 1))
                .limit(HRsPerPage);
        } catch (error) {
            console.error("Error getting approved hiring managers:", error);
          return []
        }
    }

    async HRCountApproved(): Promise<number | null> {
        try {
            return await this.hrModel.countDocuments({ isApproved: true });
        } catch (error) {
            console.error("Error getting approved HR count:", error);
            return null 
        }
    }

    async blockUblockHR(email: string, isBlocked: boolean): Promise<any> {
        try {
            return await this.hrModel.updateOne(
                { email: email },
                { $set: { isBlocked: !isBlocked } }
            );
        } catch (error) {
            console.error("Error blocking/unblocking HR:", error);
            return null 
        }
    }

    async hrApprove(email: string): Promise<any> {
        try {
            return await this.hrModel.updateOne(
                { email: email },
                { $set: { isApproved: true } }
            );
        } catch (error) {
            console.error("Error approving HR:", error);
            return null 
        }
    }

    async getPlans(): Promise<any[]> {
        try {
            return await this.planModel.find({ isActive: true });
        } catch (error) {
            console.error("Error getting plans:", error);
            return []
        }
    }

    async getPlanData(planId: string): Promise<any> {
        try {
            return await this.planModel.findOne({ _id: new ObjectId(planId) });
        } catch (error) {
            console.error("Error getting plan data:", error);
            return null 
        }
    }

    async updatePlan(planId: string, body: updatedPlan): Promise<any> {
        try {
            return await this.planModel.updateOne(
                { _id: planId },
                {
                    $set: {
                        amount: body.amount,
                        planName: body.planName,
                        duration: body.duration,
                    },
                }
            );
        } catch (error) {
            console.error("Error updating plan:", error);
            return null 
        }
    }

    async deletePlan(id: string): Promise<any> {
        try {
            return await this.planModel.updateOne(
                { _id: id },
                { $set: { isActive: false } }
            );
        } catch (error) {
            console.error("Error deleting plan:", error);
            return null         }
    }

    async findUsersTotal(): Promise<number | null> {
        try {
            return await this.userModel.countDocuments({ isBlocked: false });
        } catch (error) {
            console.error("Error finding total users:", error);
            return null;
        }
    }

    async findHRTotal(): Promise<number | null> {
        try {
            return await this.hrModel.countDocuments({ isApproved: true });
        } catch (error) {
            console.error("Error finding total HR:", error);
            return null;
        }
    }

    async findTotalActiveSubcribers(): Promise<number | null> {
        try {
            return await this.userModel.countDocuments({ "subscription.isSubscribed": true });
        } catch (error) {
            console.error("Error finding total active subscribers:", error);
            return null;
        }
    }

    async findTotalRevenueGenerated(): Promise<any> {
        try {
            return await this.transactionModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ]);
        } catch (error) {
            console.error("Error finding total revenue generated:", error);
            return null;
        }
    }
}
