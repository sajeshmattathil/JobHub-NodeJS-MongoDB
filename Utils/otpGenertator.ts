const generateOtp = () => {
    const otp = String(Math.random()).slice(2,8)
    if(String(otp).length < 6)  generateOtp()
    else  return otp
}
export default generateOtp