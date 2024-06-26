import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { Request,Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';


const generateToken = (email : string, _id : ObjectId) => {

    try {
        const token = jwt.sign({ HRId: email ,_id : _id}, process.env.HR_SECRET_KEY as string,{ expiresIn: '24h' });
  return token
    } catch (error) {
    console.error('error happen in generating HR token');
        
    }
  
 
};

interface AuthenticatedRequest extends Request {
  _id?: ObjectId;
  HRId?: string; 
}
const verifyToken = (req : AuthenticatedRequest, res : Response , next : NextFunction)  => {

    try {
        const header : string | undefined = req.headers.authorization
const role : string | undefined |string[] = req.headers.role

let token: string | null = null
  if(header !== undefined) {
     token = header.split(' ')[1]
  } 

  if (!token?.trim() || role !== 'HR' ) {
    return res.json({status:404,message:'Authentication failed'});
  }

const decodedPayload = jwt.verify(token, process.env.HR_SECRET_KEY as string) as JwtPayload;
req.HRId = decodedPayload.HRId
req._id = decodedPayload._id
console.log('Access granted');

next()

    } catch (error) {
    console.error('error happend in verifying HR token and role')
        
    }

}
export default  {
  generateToken,
  verifyToken
}