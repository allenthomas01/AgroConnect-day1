const officerNotificationService = require('../services/officerNotificationServices');
let response;

//status notificatoin sent successfull
exports.officernotify = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { notificationText } = req.body;
        response = await officerNotificationService.sendNotification(notificationText);

        res.json({ status: true, success: 'Notification sent successfully'});
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
};

//status notification viewing successfull

exports.viewofficernotifications = async (req, res, next) => {
    try {
        response= await officerNotificationService.getNotification();
        res.json({ success: true, response });
      } catch (err) {
        console.error('Error fetching officer notifications:', err);
        next(err);
}
};