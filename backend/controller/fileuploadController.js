// Required dependencies
const officerModel= require('../model/officerModel');
const cloudinary = require('cloudinary').v2;




// Handle photo upload
exports.fileupload= async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ error: 'No photo file provided' });
    }

    const file = req.files.photo;
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);

    // Create a new officer record
    const officer = new officerModel({
      name: req.body.name,
      idCardPhoto: uploadResult.secure_url
    });
    await officer.save();

    res.json({ success: 'ID card photo uploaded successfully' });
  } catch (error) {
    console.error('Error uploading ID card photo:', error);
    res.status(500).json({ error: 'Failed to upload ID card photo' });
  }
};
