const memberNotificationService = require('../services/memberNotificationServices');
let response;
//status memberNotification successfull
exports.membernotify = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { notificationText } = req.body;
         response = await memberNotificationService.sendNotification(notificationText);

        res.json({ status: true, success: 'Notification sent successfully'});
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
};

//status: viewing member notifications successfull
exports.viewmembernotifications = async (req, res, next) => {
    try {
        response = await memberNotificationService.getNotification();
        res.json({ success: true, response });
      } catch (err) {
        console.error('Error fetching member notifications :', err);
        next(err);
}
};