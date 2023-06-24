const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require('bcrypt');
let errorMessage;
const { Schema }=mongoose;

//changed userSchema to farmerSchema
const memberSchema = new Schema({
    name: {
        type: String,
        required: [true, "name can't be empty"]
    },
    phone: {
        type: Number,
        unique: true,
        required: [true, "name can't be empty"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    district: {
        type: String,
        required: [true, "district is required"]
    },
    taluk:{
        type:String,
        required: [true, "taluk is required"]
    },
    block:{
        type:String,
        required: [true, "block name is required"]
    },
    kb:{
        type:String,
        required: [true, "krishibhavan is required"]
    },
    wardno:{
        type:String,
        required: [true, "ward number is required"]
    }
},{timestamps:true});

memberSchema.pre("save",async function(){
    var user = this;
    if(!user.isModified("password")){
        return
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password,salt);

        user.password = hash;
    }catch(err){
        errorMessage = `Error: Hashing password before saving failed.`;
        res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
    }
});

memberSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log('comparing password..',this.password);
        // @ts-ignore
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        errorMessage = `Error: Password does not match.`;
        res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
    }
};

const memberModel = db.model('member',memberSchema);

module.exports = memberModel;