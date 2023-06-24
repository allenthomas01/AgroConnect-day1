const officerNotificationModel = require('../model/officerNotificationModel');

let errorMessage;

class officerNotificationService{
    static async sendNotification(notificationText){
        try{
            const createNotification = new officerNotificationModel({notificationText});
            return await createNotification.save();
        }catch(err){
          errorMessage = `\n\nError: Saving officer notifications to database failed.\n\n`;
          console.log(errorMessage);
        //res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
        }
    }

    static async getNotification() {
        try {
          return await officerNotificationModel.find({});
        } catch (err) {
          errorMessage = `\n\nError: Fetching officer notifications failed.\n\n`;
          console.log(errorMessage);
          //res.status(400).json({ error: errorMessage });
          return; // Stop further execution of the code
        }
      }
}

module.exports = officerNotificationService;