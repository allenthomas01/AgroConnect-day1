const farmerModel = require('../model/farmerModel');
const jwt = require("jsonwebtoken");
let errorMessage;

class farmerService{
    static async registerFarmer(name,phone,password,district,taluk,block,kb,wardno){
        try{
            const createFarmer = new farmerModel({name,phone,password,district,taluk,block,kb,wardno});
           
            return await createFarmer.save(); 
        }catch(err){
            errorMessage = `\n\nError: Saving farmer details to database failed. Some details are missing.\n\n`;
            console.log(errorMessage);
            //res.status(400).json({ error: errorMessage });
            return ; // Stop further execution of the code
        }
    }


    static async getUserByPhone(phone){
        try{
            return await farmerModel.findOne({phone});
        }catch(err){
            console.log(err);
        }
    }

    static async checkUser(phone){
        try {
            return await farmerModel.findOne({phone});
        } catch (error) {
            errorMessage = `\n\nError: No such farmer\n\n`;
            console.log(errorMessage);
            //res.status(400).json({ error: errorMessage });
            return; // Stop further execution of the code
        }
    }

    static async generateAccessToken(tokenData,JWTSecret_Key,JWT_EXPIRE){
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }
}

module.exports = farmerService;