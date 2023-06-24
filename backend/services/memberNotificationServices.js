const memberNotificationModel = require('../model/memberNotificationModel');
let errorMessage;

class memberNotificationService{
    static async sendNotification(notificationText){
        try{
            const createNotification = new memberNotificationModel({notificationText});
            return await createNotification.save();
        }catch(err){
          errorMessage = `\n\nError: Saving member notification to database failed\n\n`;
          console.log(errorMessage);
          //res.status(400).json({ error: errorMessage });
          return; // Stop further execution of the code
        }
    }

    static async getNotification() {
        try {
          return await memberNotificationModel.find({});
        } catch (err) {
          errorMessage = `\n\nError: Fetching member notifications from database failed.\n\n`;
          console.log(errorMessage);
          //res.status(400).json({ error: errorMessage });
          return; // Stop further execution of the code
        }
      }
}

module.exports = memberNotificationService;