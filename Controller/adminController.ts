import { Request, Response } from "express";
import jwt from "../Middleware/JWT/jwtUser";
import adminService from "../Service/adminService";
import jwtAdmin from "../Middleware/JWT/jwtAdmin";

interface loginBody {
  email: string;
  password: string;
}
interface loginSubmitResponse {
  status: number;
  message: string;
  adminData?: string;
  token?: string;
}

const loginSubmit = async (
  req: Request,
  res: Response
) => {
  try {
    const verifyAdmin = await adminService.verifyLoginAdmin(req.body);
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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const response = await adminService.getAllUsers();
    if (response.status === 201) res.status(201).json({ usersData: response, status: 201 });
    else if(response.status === 500)res.status(500).json({ usersData: null, status: 500});
    else res.status(404).json({ usersData: null, status: 404 });
  } catch (error) {
    res.status(500).json({ usersData: null, status: 500 });
  }
};
interface blockunblock {
  email: string;
  isBlocked: boolean;
}

const blockUnblockUser = async (
  req: Request<{}, {}, blockunblock>,
  res: Response
) => {
  try {
    const response = await adminService.blockUblockUser(
      req.body.email,
      req.body.isBlocked
    );
    if (response.status === 201) {
      res.status(201).json({ status: 201 });
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (error) {
    res.status(500).json({ status: 500 });
  }
};
const hiringManagers = async (req: Request, res: Response) => {
  try {
    const pageNumber: string | number = req.query.page as string;
    const HRsPerPage: string | number = req.query.jobsPerPage as string;

    const response = await adminService.getHiringManagers(
      Number(pageNumber),
      Number(HRsPerPage)
    );
    if (response !== undefined) {
      if (response.status === 201) {
        res.status(201).json({
          status: 201,
          HRData: response?.data,
          totalJobs: response.totalPages,
        });
      }
       else if (response.status === 500) res.status(500).json({ status: 500, HRData: null, totalJobs: null });
      else
        res.status(404).json({ status: 404, HRData: null, totalJobs: null });
    }
  } catch (error) {
    res.status(500).json({ status: 500, HRData: null, totalJobs: null });
  }
};

const hiringmanagersApproved = async (req: Request, res: Response) => {
  try {
    const pageNumber: string | number = req.query.page as string;
    const HRsPerPage: string | number = req.query.jobsPerPage as string;

    const response = await adminService.getHiringManagersApproved(
      Number(pageNumber),
      Number(HRsPerPage)
    );
    if (response !== undefined) {
      if (response.status === 201) {
        res.status(201).json({
          status: 201,
          HRData: response?.data,
          totalJobs: response.totalPages,
        });
      }
      else if (response.status === 500) res.status(500).json({ status: 500, HRData: null, totalJobs: null });
      else
        res.status(404).json({ status: 404, HRData: null, totalJobs: null });
    }
  } catch (error) {
    res.status(500).json({ status: 500, HRData: null, totalJobs: null });
  }
};
const blockUnblockHR = async (req: Request, res: Response) => {
  try {
    const response = await adminService.blockUnblockHR(
      req.body.email,
      req.body.isBlocked
    );
    if (response.status === 201) {
      res.status(201).json({ status: 201 });
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (error) {
    res.status(500).json({ status: 500 });
  }
};
const hrApprove = async (req: Request, res: Response) => {
  try {
    const response = await adminService.hrApprove(req.body.email);

    if (response.status === 201) {
      res.status(201).json({ status: 201 });
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (error) {
    res.status(500).json({ status: 500 });

  }
};

const getAdmin = async (req: Request, res: Response) => {
  try {
    const id = (req as any).adminId;
    const response = await adminService.getAdmin(id);
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

const saveNewPlan = async (req: Request, res: Response) => {
  try {
    const response = await adminService.saveNewPlan(req.body);
    if ((response.status === 200)) res.json({ status: 200 });
    else res.json({ status: 400 });
  } catch (error) {
    res.json({ status: 500 });
  }
};

const getPlans = async (req: Request, res: Response) => {
  try {
    const response = await adminService.getPlans();
    if ((response.status === 201))
      res.json({ status: 201, planDatas: response.data });
    else res.json({ status: 400, planDatas: null });
  } catch (error) {
    res.json({ status: 500, planDatas: null });
  }
};

const getPlanData = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const response = await adminService.getPlanData(String(planId));
    if ((response.status === 201))
      res.json({ status: 201, planData: response.data });
    else res.json({ status: 400, planData: null });
  } catch (error) {
    console.log("error happened in get plan data in admincontroller");
    res.json({ status: 500, planData: null });
  }
};

const updatePlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const response = await adminService.updatePlan(String(planId), req.body);
    if ((response.status === 201)) res.json({ status: 201 });
    else res.json({ status: 400 });
  } catch (error) {
    res.json({ status: 500 });
  }
};

const deletePlan = async (req: Request, res: Response) =>{
   try {
      const { id } = req.params;
      const response = await adminService.deletePlan(String(id));
      if ((response.status === 200)) res.json({ status: 200 });
      else res.json({ status: 400 });
   } catch (error) {
    res.json({ status: 500 });
   }
}
const getDashboardData = async (req: Request, res: Response)=>{
 try {
  const dashboardData = await adminService.getAllDashboardData()
  if(dashboardData.status === 202) res.status(202).json({dashboardData : dashboardData?.data})
    else res.status(404).json({message : dashboardData?.error})
 } catch (error) {
  res.status(500).json({message : "Something went wrong!"})
 }
}

export default {
  getAdmin,
  loginSubmit,
  getAllUsers,
  blockUnblockUser,
  hiringManagers,
  hiringmanagersApproved,
  blockUnblockHR,
  hrApprove,
  saveNewPlan,
  getPlans,
  getPlanData,
  updatePlan,
  deletePlan,
  getDashboardData
};
