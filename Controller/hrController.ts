import { Request,Response } from "express";
import hrService from "../Service/hrService";

const hrSignup =async (req:Request ,res : Response)=>{
    try {
        console.log(req.body,'hrsignup');
        const saveHrData = await hrService.saveHrData(req.body)
        
    } catch (error) {
        
    }
}

export default {
    hrSignup
}