import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { Request,Response, NextFunction } from 'express';


const generateToken = (email : string) => {
  try {
  const token = jwt.sign({ userId: email }, process.env.USER_SECRET_KEY as string,{ expiresIn: '24h' });
  return token
  } catch (error) {
    console.error('error happen in generating user token');
  }
  
 
};
const verifyToken = (req : Request, res : Response , next : NextFunction)  => {
  try {
    const header : string | undefined = req.headers.authorization
const role : string | undefined |string[] = req.headers.role
console.log(role,'role ---user');


let token: string | null = null
  if(header !== undefined) {
     token = header.split(' ')[1]
  } 

  if (!token || role !== 'user' ) {
    return res.json({status:404 ,message :'authentication or authorization failed'});
  }

const decodedPayload = jwt.verify(token, process.env.USER_SECRET_KEY as string) as JwtPayload;
console.log(decodedPayload.userId,'User id');
console.log('Access granted');

next()

  } catch (error) {
    console.error('error happend in verifying user token and role')
  }

}
export default  {
  generateToken,
  verifyToken,
  
}