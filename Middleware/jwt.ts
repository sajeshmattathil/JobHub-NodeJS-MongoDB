import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { Request,Response, NextFunction } from 'express';


const generateToken = (email : string) => {
  const token = jwt.sign({ userId: email }, process.env.SECRET_KEY as string,{ expiresIn: '24h' });
  return token
 
};
const verifyToken = (req : Request, res : Response , next : NextFunction)  => {
const header : string | undefined = req.headers.authorization

let token: string | null = null
  if(header !== undefined) {
     token = header.split(' ')[1]
  } 

  if (!token) {
    return res.json({status:404});
  }

const decodedPayload = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
console.log(decodedPayload.userId,'User id');
console.log('Access granted');

next()

}
export default  {
  generateToken,
  verifyToken
}