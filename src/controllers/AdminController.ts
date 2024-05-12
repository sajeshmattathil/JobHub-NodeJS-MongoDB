import { AdminInteractor } from "../interactors/adminInteractor";
import { Request, Response } from "express";
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from "../../Utils";
import jwtAdmin from "../../Middleware/JWT/jwtAdmin";
import { IAdminInteractor } from "../interfaces/IAdminInteractor";

@injectable()
export class AdminController {
    private interactor: IAdminInteractor;

    constructor(@inject(INTERFACE_TYPE.AdminInteractor)interactor: IAdminInteractor) {
        this.interactor = interactor;
    }
     async loginSubmit (
        req: Request,
        res: Response
      ): Promise<void>{
        try {
          const verifyAdmin = await this.interactor.verifyLoginAdmin(req.body);
          if (verifyAdmin?.adminData) {
            const token: string | undefined = jwtAdmin.generateToken(
              verifyAdmin.adminData
            );
            res.status(201).json({
              status: 201,
              message: "User verification successful",
              adminData: verifyAdmin.adminData,
              token: token,
            });
          } else if(verifyAdmin.status === 401) {
            res.status(401).json({
              status: 401,
              message: "Admin login failed. Invalid credentials.",
            });
          }
          else {
            res.status(404).json({
              status: 404,
              message: "Admin login failed. Invalid credentials.",
            });
          }
        } catch (error) {
          res.status(500).json({
            status: 500,
            message: "Something went wrong, try again ",
          });
        }
      };

   async getAdmin (req: Request, res: Response) : Promise<void> {
        try {
          const id = (req as any).adminId;
          const response = await this.interactor.getAdmin(id);
          if (response?.status === 201) {
            res.status(201).json({ status: 201, admin: response?.data });
          }
          if (response?.status === 500)
            res.status(500).json({ status: 500, admin: null });
          if (response?.status === 400)
            res.status(400).json({ status: 400, admin: null });
        } catch (error) {
          res.status(500).json({ status: 500, admin: null });
        }
      };
      
  async getAllUsers (req: Request, res: Response) : Promise<void> {
        try {
          const response = await this.interactor.getAllUsers();
          if (response.status === 201) res.status(201).json({ usersData: response, status: 201 });
          else if(response.status === 500)res.status(500).json({ usersData: null, status: 500});
          else res.status(404).json({ usersData: null, status: 404 });
        } catch (error) {
          res.status(500).json({ usersData: null, status: 500 });
        }
      };
    
    async blockUnblockUser(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.interactor.blockUblockUser(req.body.email, req.body.isBlocked);
            if (response.status === 201) {
                res.status(201).json({ status: 201 });
            } else {
                res.status(404).json({ status: 404 });
            }
        } catch (error) {
            res.status(500).json({ status: 500 });
        }
    }

    async hiringManagers(req: Request, res: Response): Promise<void> {
        try {
            const pageNumber: string | number = req.query.page as string;
            const HRsPerPage: string | number = req.query.jobsPerPage as string;

            const response = await this.interactor.getHiringManagers(Number(pageNumber), Number(HRsPerPage));
            if (response !== undefined) {
                if (response.status === 201) {
                    res.status(201).json({
                        status: 201,
                        HRData: response?.data,
                        totalJobs: response.totalPages,
                    });
                } else if (response.status === 500) res.status(500).json({ status: 500, HRData: null, totalJobs: null });
                else res.status(404).json({ status: 404, HRData: null, totalJobs: null });
            }
        } catch (error) {
            res.status(500).json({ status: 500, HRData: null, totalJobs: null });
        }
    }

    async hiringmanagersApproved(req: Request, res: Response): Promise<void> {
        try {
            const pageNumber: string | number = req.query.page as string;
            const HRsPerPage: string | number = req.query.jobsPerPage as string;

            const response = await this.interactor.getHiringManagersApproved(Number(pageNumber), Number(HRsPerPage));
            if (response !== undefined) {
                if (response.status === 201) {
                    res.status(201).json({
                        status: 201,
                        HRData: response?.data,
                        totalJobs: response.totalPages,
                    });
                } else if (response.status === 500) res.status(500).json({ status: 500, HRData: null, totalJobs: null });
                else res.status(404).json({ status: 404, HRData: null, totalJobs: null });
            }
        } catch (error) {
            res.status(500).json({ status: 500, HRData: null, totalJobs: null });
        }
    }

    async blockUnblockHR(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.interactor.blockUnblockHR(req.body.email, req.body.isBlocked);
            if (response.status === 201) {
                res.status(201).json({ status: 201 });
            } else {
                res.status(404).json({ status: 404 });
            }
        } catch (error) {
            res.status(500).json({ status: 500 });
        }
    }

    async hrApprove(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.interactor.hrApprove(req.body.email);
            if (response.status === 201) {
                res.status(201).json({ status: 201 });
            } else {
                res.status(404).json({ status: 404 });
            }
        } catch (error) {
            res.status(500).json({ status: 500 });
        }
    }

    async saveNewPlan(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.interactor.saveNewPlan(req.body);
            if (response.status === 200) res.json({ status: 200 });
            else res.json({ status: 400 });
        } catch (error) {
            res.json({ status: 500 });
        }
    }

    async getPlans(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.interactor.getPlans();
            if (response.status === 201) res.json({ status: 201, planDatas: response.data });
            else res.json({ status: 400, planDatas: null });
        } catch (error) {
            res.json({ status: 500, planDatas: null });
        }
    }

    async getPlanData(req: Request, res: Response): Promise<void> {
        try {
            const { planId } = req.params;
            const response = await this.interactor.getPlanData(String(planId));
            if (response.status === 201) res.json({ status: 201, planData: response.data });
            else res.json({ status: 400, planData: null });
        } catch (error) {
            console.log("error happened in get plan data in admincontroller");
            res.json({ status: 500, planData: null });
        }
    }

    async updatePlan(req: Request, res: Response): Promise<void> {
        try {
            const { planId } = req.params;
            const response = await this.interactor.updatePlan(String(planId), req.body);
            if (response.status === 201) res.json({ status: 201 });
            else res.json({ status: 400 });
        } catch (error) {
            res.json({ status: 500 });
        }
    }

    async deletePlan(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this.interactor.deletePlan(String(id));
            if (response.status === 200) res.json({ status: 200 });
            else res.json({ status: 400 });
        } catch (error) {
            res.json({ status: 500 });
        }
    }

    async getDashboardData(req: Request, res: Response): Promise<void> {
        try {
            const dashboardData = await this.interactor.getAllDashboardData();
            if (dashboardData.status === 202) res.status(202).json({ dashboardData: dashboardData?.data });
            else res.status(404).json({ message: dashboardData?.error });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
        }
    }
}

