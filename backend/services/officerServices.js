const officerModel = require('../model/officerModel');
const jwt = require("jsonwebtoken");
let errorMessage;

class officerService{
    static async registerOfficer(name,phone,password,district,taluk,block,kb,wardno){
        try{
            const createOfficer = new officerModel({name,phone,password,district,taluk,block,kb,wardno});
            return await createOfficer.save();
        }catch(err){
            errorMessage = `\n\nError: Couldn't save officer details to database.\n\n`;
            console.log(errorMessage);
            //res.status(400).json({ error: errorMessage });
            return; // Stop further execution of the code
        }
    }

    static async getUserByPhone(phone){
        try{
            return await officerModel.findOne({phone});
        }catch(err){
            errorMessage = `\n\nError: Officer not found\n\n`;
            console.log(errorMessage);
            //res.status(400).json({ error: errorMessage });
            return; // Stop further execution of the code
        }
    }

    static async checkUser(phone){
        try {
            return await officerModel.findOne({phone});
        } catch (error) {
            errorMessage = `\n\nError: No such officer exist\n\n`;
            console.log(errorMessage);
            //res.status(400).json({ error: errorMessage });
            return; // Stop further execution of the code
        }
    }

    static async generateAccessToken(tokenData,JWTSecret_Key,JWT_EXPIRE){
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }


};

module.exports = officerService;