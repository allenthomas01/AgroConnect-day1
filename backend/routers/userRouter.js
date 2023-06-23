const router = require('express').Router();
const userController = require('../controller/userController');

router.post('/registeruser',userController.register);
router.post('/login', userController.login);
router.post('/verify',userController.verify);
router.post('/farmerforgotPassword', userController.forgotPassword);
router.post('/farmerresetPassword', userController.resetPassword); 

/* router.post('/registermember',memberController.register);
router.post('/memberlogin', memberController.login);
router.post('/memberforgotPassword', memberController.forgotPassword);
router.post('/memberresetPassword', memberController.resetPassword); 
router.post('/officerforgotPassword', officerController.forgotPassword);
router.post('/officerresetPassword', officerController.resetPassword); 
 */
module.exports = router;