export interface IAdminRepository {
    findAdmin(email: string): Promise<any>;
    getAllUsers(): Promise<any[]>;
    blockUblockUser(email: string, isBlocked: boolean): Promise<any>;
    getHiringManagers(pageNumber: number, HRsPerPage: number): Promise<any[]>;
    HRCount(): Promise<number | null>;
    getHiringManagersApproved(pageNumber: number, HRsPerPage: number): Promise<any[]>;
    HRCountApproved(): Promise<number | null>;
    blockUblockHR(email: string, isBlocked: boolean): Promise<any>;
    hrApprove(email: string): Promise<any>;
    getPlans(): Promise<any[]>;
    getPlanData(planId: string): Promise<any>;
    updatePlan(planId: string, body: updatedPlan): Promise<any>;
    deletePlan(id: string): Promise<any>;
    findUsersTotal(): Promise<number | null>;
    findHRTotal(): Promise<number | null>;
    findTotalActiveSubcribers(): Promise<number | null>;
    findTotalRevenueGenerated(): Promise<any>;
  }
  
  export interface updatedPlan {
    amount: string;
    duration: string;
    planName: string;
  }