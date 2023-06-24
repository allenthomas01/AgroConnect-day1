const router = require('express').Router();
const userController = require('../controller/userController');
const fileuploadController = require('../controller/fileuploadController');

router.post('/registeruser',userController.register);
router.post('/login', userController.login);
router.post('/verify',userController.verify);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);
router.post('/fileupload', fileuploadController.fileupload); 


module.exports = router;