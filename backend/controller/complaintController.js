const complaintService = require('../services/complaintServices');
let response;

//registering complaint successfull
exports.complaint = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { complaintText } = req.body;
        response= await complaintService.registerComplaint(complaintText);

        res.json({ status: true, success: 'Complaint registered successfully'});
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}


//viewing complaint successfull
exports.viewComplaints = async (req, res, next) => {
  try {
    // Fetch all existing complaints
    response = await complaintService.viewComplaints();
    console.log("\n\nExisting complaints:\n\n", response);
    res.json({ status: true, success: 'Complaints fetched successfully',response:response});
  } catch (err) {
    console.log("---> err -->", err);
    next(err);
  }
};

