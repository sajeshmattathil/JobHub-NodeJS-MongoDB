import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";

const generateToken = (email: string, _id: ObjectId | string) => {
  try {
    console.log(_id,'jwt');
    
    const token = jwt.sign(
      { userId: email, _id: _id },
      process.env.USER_SECRET_KEY as string,
      { expiresIn: "24h" }
    );
    return token;
  } catch (error) {
    console.error("error happen in generating user token");
  }
};
interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: ObjectId;
}
const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const header: string | undefined = req.headers.authorization;
    const role: string | undefined | string[] = req.headers.role;

    let token: string | null = null;
    if (header !== undefined) {
      token = header.split(" ")[1];
    }

    if (!token || role !== "user") {
      console.log('Authentication failed',token,role)
      return res.json({
        status: 404,
        message: "authentication or authorization failed in jwt verification",
      });
    }

    const decodedPayload = jwt.verify(
      token,
      process.env.USER_SECRET_KEY as string
    ) as JwtPayload;
    req.userEmail = decodedPayload.userId;
    req.userId = decodedPayload._id;
    
    console.log("Access granted");

    next();
  } catch (error) {
    console.error("error happend in verifying user token and role");
    res.status(400).json({status :400,message :'Error happend in verifying user'})
  }
};
export default {
  generateToken,
  verifyToken,
};
