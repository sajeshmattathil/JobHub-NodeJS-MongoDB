import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { Request,Response, NextFunction } from 'express';


const generateToken = (email : string) => {
    try {
        const token = jwt.sign({ adminId: email }, process.env.ADMIN_SECRET_KEY as string,{ expiresIn: '24h' });
        return token
    } catch (error) {
    console.error('error happen in generating admin token');    
    }
 
 
};

interface AuthenticatedRequest extends Request {
  adminId?: string; 
}

const verifyToken = (req : AuthenticatedRequest, res : Response , next : NextFunction)  => {
    try {
        const header : string | undefined = req.headers.authorization
const role : string | undefined |string[] = req.headers.role

let token: string | null = null
  if(header !== undefined) {
     token = header.split(' ')[1]
     
  } 

  if (!token || role !== 'admin' ) {
    return res.json({status:404});
  }

const decodedPayload = jwt.verify(token, process.env.ADMIN_SECRET_KEY as string) as JwtPayload;
console.log(decodedPayload.adminId,'adminId');
req.adminId = decodedPayload.adminId
console.log('Access granted');

next()

    } catch (error) {
    console.error('error happend in verifying user token and role')
    }

}
export default  {
  generateToken,
  verifyToken
}