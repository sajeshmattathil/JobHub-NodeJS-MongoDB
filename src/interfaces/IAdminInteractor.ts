import { ObjectId } from "mongodb";

export interface IAdminInteractor {
    
    verifyLoginAdmin(body: loginBody): Promise<{ adminData: any | null; status: number }>;

    getAllUsers(): Promise<{ data: any[] | null; status: number }>;

    blockUblockUser(email: string, isBlocked: boolean): Promise<{ status: number }>;

    getHiringManagers(pageNumber: number, HRsPerPage: number): Promise<{ data: any[] | null; totalPages: number | null; status: number }>;
    
    getHiringManagersApproved(pageNumber: number, HRsPerPage: number): Promise<{ data: any[] | null; totalPages: number | null; status: number }>;
    
    blockUnblockHR(email: string, isBlocked: boolean): Promise<{ status: number }>;
    
    hrApprove(email: string): Promise<{ status: number }>;
    
    getAdmin(id: string): Promise<{ data: any | null; status: number }>;
    
    saveNewPlan(body: any): Promise<{ status: number }>;
    
    getPlans(): Promise<{ data: any[] | null; status: number }>;
    
    getPlanData(planId: string): Promise<{ data: any | null; status: number }>;
    
    updatePlan(planId: string, body: updatedPlan): Promise<{ status: number }>;
    
    deletePlan(id: string): Promise<{ status: number }>;
    
    getAllDashboardData(): Promise<{ data: any | null; error?: string; status: number }>;
}
export interface updatedPlan {
    amount: string;
    duration: string;
    planName: string;
  }
  export interface loginBody {
    email: string;
    password: string;
}

export interface adminDetailsInterface {
    _id: ObjectId;
    email: string;
    password: string;
}