const OTPModel = require('../model/otpModel');
require("dotenv").config();
const fast2sms = require('fast-two-sms');
let errorMessage;

class otpService{
    static async generateAndSendOTP(phone){
        try{
          const otpCode = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP 
          await OTPModel.deleteMany({ phone });
          var options = {
            authorization : process.env.FAST2SMS_API_KEY , 
            message : 'Your OTP is '+otpCode ,  
            numbers : [phone]
          } 
           fast2sms.sendMessage(options) //Asynchronous Function.
          .then(response=>{
            console.log(response)
          })
          .catch(err=>{
            console.log(err)
          })
  

          const otp = new OTPModel({
             phone:phone,
             code: otpCode,
             createdAt: new Date(),
          });
           otp.save({ timeout: 60000 });// otp deletes after 10 minutes
           return otpCode;
        }catch(err){
          errorMessage = `\n\nError: Generating OTP failed.\n\n`;
          console.log(errorMessage);
        //res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
        }
    }

    static async verifyOTP(otpCode) {
      try {
        const savedOTP = await OTPModel.find({code: otpCode });
        console.log(savedOTP);
        if (savedOTP=="") {

          return false;
        } else {
          
          return true;
        }
      } catch (err) {
        errorMessage = `\n\nError: OTP verification failed.\n\n`;
        console.log(errorMessage);
        //res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
      }
    }
}

module.exports = otpService;