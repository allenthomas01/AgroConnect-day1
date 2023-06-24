const router = require('express').Router();
const memberNotificationController = require('../controller/memberNotificationController');

router.post('/memberNotification',memberNotificationController.membernotify);
router.post('/getmembernotification',memberNotificationController.viewmembernotifications);

module.exports = router;