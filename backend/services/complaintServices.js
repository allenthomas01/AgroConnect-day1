const complaintModel = require('../model/complaintModel');
let errorMessage;

class complaintService{
    static async registerComplaint(complaintText){
        try{
            const createComplaint = new complaintModel({complaintText});
            return await createComplaint.save();
        }catch(err){
          errorMessage = `\n\nError: Saving complaint to database failed.\n\n`;
          console.log(errorMessage);
          //res.status(400).json({ error: errorMessage });
          return; // Stop further execution of the code
        }
    }


    static async viewComplaints() {
        try {
          return await complaintModel.find({});
        } catch (err) {
          errorMessage = `\n\nError: Fetching complaints from database failed\n\n`;
          console.log(errorMessage);
          //res.status(400).json({ error: errorMessage });
          return; // Stop further execution of the code
        }
      }
}

module.exports = complaintService;