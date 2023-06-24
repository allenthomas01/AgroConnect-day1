const farmerService = require('../services/farmerServices');
const memberService = require('../services/memberServices');
const officerService = require('../services/officerServices');
const otpService = require('../services/otpServices');
const OTPModel = require('../model/otpModel');
let errorMessage;
let response;
let message;

// STATUS:  REGISTRATION SUCCESSFULL
exports.register = async (req, res, next) => {
  try {
    console.log("---req body---", req.body);
    const { userType, name, phone, password, district, taluk, block, kb, wardno} = req.body;

    if (userType === 'farmer') {
      const duplicate = await farmerService.getUserByPhone(phone);
      if (duplicate) {
        errorMessage = `Error: UserName ${phone}, Already Registered`;
        console.log('\n\n',errorMessage,'\n\n');
        res.status(400).json({ error: errorMessage });
        return; 
      }

      response = await farmerService.registerFarmer(name, phone, password, district, taluk, block, kb, wardno);
    } else if (userType === 'member') {
      const duplicate = await memberService.getUserByPhone(phone);
      if (duplicate) {
        errorMessage = `Error: UserName ${phone}, Already Registered`;
        console.log('\n\n',errorMessage,'\n\n');
        res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
      }

      response = await memberService.registerMember(name, phone, password, district, taluk, block, kb, wardno);
    } else{
      const duplicate = await officerService.getUserByPhone(phone);
      if (duplicate) {
        errorMessage = `Error: UserName ${phone}, Already Registered`;
        console.log('\n\n',errorMessage,'\n\n');
        res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
      }
      response = await officerService.registerOfficer(name, phone, password, district, taluk, block, kb, wardno);
    }

    if(response==undefined){
      res.json({ status:false,failed: `Registration failed` });
      return; // Stop further execution of the code
    }
    const generatedCode = await otpService.generateAndSendOTP(phone);
    message = "OTP sent successfully to mobile.";
    console.log("\n\n",message,"\n\n");
    res.json({ status: true, success:message});
  } catch (err) {
    console.log("\n\nError: ", err);
    next(err);
  }
};



// STATUS:  OTP VERIFICATION SUCCESSFULL
exports.verify = async (req, res, next) => {
  try {
    console.log("\n\n---req body---\n\n", req.body);
    const { enteredCode } = req.body;
    
    const isValidOTP = await otpService.verifyOTP(enteredCode);
    if (isValidOTP=="") {
      errorMessage = `Error: Invalid OTP`;
      res.status(400).json({ error: errorMessage });
      return; // Stop further execution of the code
    }
    // deleting otp 
    await OTPModel.deleteOne({code:enteredCode});
    message="OTP verification successfull";
    console.log("\n\n",message,"\n\n");
    res.json({ status: true, success: message });
  } catch (err) {
    console.log("\n\nError:---> err -->\n", err);
    next(err);
  }
};



// STATUS LOGIN SUCCESSFULL
exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      errorMessage = `Error: Login failed. Credentials are not correct`;
      res.status(400).json({ error: errorMessage });
      return; // Stop further execution of the code
    }

    let user, userType;
    // Check farmerModel
    user = await farmerService.checkUser(phone);
    if (user) {
      userType = 'farmer';
    } else {
      // Check memberModel
      user = await memberService.checkUser(phone);
      if (user) {
        userType = 'member';
      } else {
        // Check officerModel
        user = await officerService.checkUser(phone);
        if (user) {
          userType = 'officer';
        } else {
          errorMessage = `Error: Login failed. User does not exist`;
          res.status(400).json({ error: errorMessage });
          return; // Stop further execution of the code
        }
      }
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      errorMessage = `Error: Login failed. Password does not match`;
      res.status(400).json({ error: errorMessage });
      return; // Stop further execution of the code
    }

    // Creating Token
    const tokenData = { _id: user._id, phone: user.phone, userType };
    const token = await farmerService.generateAccessToken(tokenData, "secret", "1h");
    message = "login successfull";
    console.log("\n\n",message,"\n\n");
    res.status(200).json({ status: true, success: message, token: token ,userType:userType});
  } catch (error) {
    console.log('\n\nError: err---->\n',error);
    next(error);
  }
};



// status successfull
exports.forgotPassword = async (req, res, next) => {
    try {
      const { phone } = req.body;
      let user, userType;
      // Check farmerModel
      user = await farmerService.checkUser(phone);
      if (user) {
        userType = 'farmer';
      } else {
        // Check memberModel
        user = await memberService.checkUser(phone);
        if (user) {
          userType = 'member';
        } else {
          // Check officerModel
          user = await officerService.checkUser(phone);
          if (user) {
            userType = 'officer';
          } else {
            errorMessage = `Forgot password option failed. User not found`;
            console.log("\n\n",errorMessage,"\n\n")
            res.status(400).json({ error: errorMessage });
            return; // Stop further execution of the code
          }
        }
      }
  
      // Generate and send OTP
      //const otpCode = await otpService.generateAndSendOTP(phone);
      await otpService.generateAndSendOTP(phone);
  
      // Save OTP to user's document or any other storage as needed
     // user.otp = otpCode;
      await user.save();
      message="OTP for password reset sent successfully"
      console.log("\n\n",message,"\n\n");
      res.json({ status: true, message:message });
    } catch (err) {
      console.log("---> err -->", err);
      next(err);
    }
  };

  
  // status reset password successfull
exports.resetPassword = async (req, res, next) => {
    try {
      const { phone, otp, newPassword } = req.body;
      let user, userType;
      // Check farmerModel
      user = await farmerService.checkUser(phone);
      if (user) {
        userType = 'farmer';
      } else {
        // Check memberModel
        user = await memberService.checkUser(phone);
        if (user) {
          userType = 'member';
        } else {
          // Check officerModel
          user = await officerService.checkUser(phone);
          if (user) {
            userType = 'officer';
          } else {
            errorMessage = `Password reset failed. User not found`;
            console.log("\n\n",errorMessage,"\n\n")
            res.status(400).json({ error: errorMessage });
            return; // Stop further execution of the code
          }
        }
      }
  
      // Verify OTP
      const savedOTP = await OTPModel.findOne({ phone: phone, code: otp }).sort({ createdAt: -1 });
  
      if (!savedOTP) {
        errorMessage = `Invalid OTP. Password reset failed.`;
        console.log("\n\n",errorMessage,"\n\n")
        res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
      }
  
      // Check OTP validity (e.g., within a certain time limit)

  
      // Update user's password
      user.password = newPassword;
      await user.save();
  
      // Delete the used OTP
      await OTPModel.findOneAndDelete({ phone });
      message="Password reset successfully";
      console.log("\n\n",message,"\n\n");
      res.json({ status: true, message: message });
    } catch (err) {
      console.log("---> err -->", err);
      next(err);
    }
  };
  