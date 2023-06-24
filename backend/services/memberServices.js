const memberModel = require('../model/memberModel');
const jwt = require("jsonwebtoken");
let errorMessage;

class memberService{
    static async registerMember(name,phone,password,district,taluk,block,kb,wardno){
        try{
            const createMember = new memberModel({name,phone,password,district,taluk,block,kb,wardno});
            return await createMember.save();
        }catch(err){
            errorMessage = `\n\nError: Saving member to database failed.\n\n`;
            console.log(errorMessage);
            //res.status(400).json({ error: errorMessage });
            return; // Stop further execution of the code
        }
    }

    static async getUserByPhone(phone){
        try{
            return await memberModel.findOne({phone});
        }catch(err){
            errorMessage = `\n\nError: No such member exist.\n\n`;
            console.log(errorMessage);
            //res.status(400).json({ error: errorMessage });
            return; // Stop further execution of the code
        }
    }

    static async checkUser(phone){
        try {
            return await memberModel.findOne({phone});
        } catch (error) {
            errorMessage = `\n\nError: Member not found\n\n`;
            console.log(errorMessage);
            //res.status(400).json({ error: errorMessage });
            return; // Stop further execution of the code
        }
    }

    static async generateAccessToken(tokenData,JWTSecret_Key,JWT_EXPIRE){
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }


};

module.exports = memberService;