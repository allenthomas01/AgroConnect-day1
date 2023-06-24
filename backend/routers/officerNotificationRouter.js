const router = require('express').Router();
const officerNotificationController = require('../controller/officerNotificationController');

router.post('/officerNotification',officerNotificationController.officernotify);
router.post('/viewofficernotification',officerNotificationController.viewofficernotifications);

module.exports = router;