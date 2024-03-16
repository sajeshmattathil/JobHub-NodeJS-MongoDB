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
  req: Request<{}, {}, loginBody>,
  res: Response<loginSubmitResponse>
) => {
  try {
    console.log(req.body, "body");

    const verifyAdmin = await adminService.verifyLoginAdmin(req.body);

    console.log(verifyAdmin, "verify user");

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
    } else {
      res.status(200).json({
        status: 200,
        message: "Admin login failed. Invalid credentials.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const response = await adminService.getAllUsers();
    console.log(response, "response");
    if (response) res.status(201).json({ usersData: response, status: 201 });
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
    console.log(response, "blockREsoponse");

    if (response.message) {
      res.status(201).json({ status: 201 });
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (error) {
    console.log("error in block user in controller");
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
    console.log(response, "hrs response controller");

    if (response !== undefined) {
      if (response.message === "success") {
        res.status(201).json({
          status: 201,
          HRData: response?.data,
          totalJobs: response.totalPages,
        });
      } else
        res.status(404).json({ status: 404, HRData: null, totalJobs: null });
    }
  } catch (error) {
    console.log("error happened in fetching HR data in admincontroller");
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
    console.log(response, "hrs response controller");

    if (response !== undefined) {
      if (response.message === "success") {
        res.status(201).json({
          status: 201,
          HRData: response?.data,
          totalJobs: response.totalPages,
        });
      } else
        res.status(404).json({ status: 404, HRData: null, totalJobs: null });
    }
  } catch (error) {
    console.log("error happened in fetching HR data in admincontroller");
    res.status(500).json({ status: 500, HRData: null, totalJobs: null });
  }
};
const blockUnblockHR = async (req: Request, res: Response) => {
  try {
    const response = await adminService.blockUnblockHR(
      req.body.email,
      req.body.isBlocked
    );
    console.log(response, "HRblockREsoponse");

    if (response.message) {
      res.status(201).json({ status: 201 });
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (error) {}
};
const hrApprove = async (req: Request, res: Response) => {
  try {
    const response = await adminService.hrApprove(req.body.email);
    console.log(response, "HRblockREsoponse");

    if (response.message) {
      res.status(201).json({ status: 201 });
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (error) {}
};

const getAdmin = async (req: Request, res: Response) => {
  try {
    const id = (req as any).adminId;
    console.log(id, "getadmin --- id");

    const response = await adminService.getAdmin(id);
    console.log(response, "getadmin --- response");

    if (response?.message === "success") {
      res.status(201).json({ status: 201, admin: response?.data });
    }
    if (response?.message === "error")
      res.status(500).json({ status: 500, admin: null });
    if (response?.message === "Not found")
      res.status(400).json({ status: 400, admin: null });
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const saveNewPlan = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "req.body");

    const response = await adminService.saveNewPlan(req.body);
    console.log(response, "response---plan");
    if ((response.message = "success")) res.json({ status: 200 });
    else res.json({ status: 400 });
  } catch (error) {
    console.log("error happened in saving plan data in admincontroller");
    res.json({ status: 500 });
  }
};

const getPlans = async (req: Request, res: Response) => {
  try {
    const response = await adminService.getPlans();
    console.log(response, "response---getplans");
    if ((response.message === "success"))
      res.json({ status: 201, planDatas: response.data });
    else res.json({ status: 400, planDatas: null });
  } catch (error) {
    console.log("error happened in get all plan data in admincontroller");
    res.json({ status: 500, planDatas: null });
  }
};

const getPlanData = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    console.log(planId, "id----");

    const response = await adminService.getPlanData(String(planId));
    console.log(response, "response--- plan one");
    if ((response.message = "success"))
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
    console.log(planId, "id----");
    const response = await adminService.updatePlan(String(planId), req.body);
    if ((response.message = "success")) res.json({ status: 201 });
    else res.json({ status: 400 });
  } catch (error) {
    console.log("error happened in update plan data in admincontroller");
    res.json({ status: 500 });
  }
};

const deletePlan = async (req: Request, res: Response) =>{
   try {
      const { id } = req.params;
      console.log(id, "id----");
      const response = await adminService.deletePlan(String(id));
      if ((response.message = "success")) res.json({ status: 200 });
      else res.json({ status: 400 });
   } catch (error) {
    res.json({ status: 500 });
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
  deletePlan
};
