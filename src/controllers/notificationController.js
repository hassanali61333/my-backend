import webpush from "../config/webpush.js"
import PushSubscription from "../models/pushSubscriptionModel.js";

export const sendPushNotification = async (userID, title, body) => {
  try {
    const subscriptions = await PushSubscription.find({
      userID: userID,
    });

    console.log("Subscriptions found:", subscriptions.length);

    if (subscriptions.length === 0) {
      console.log("No push subscription found for this user");
      return;
    }

    const payload = JSON.stringify({
      title,
      body,
    });

    for (const item of subscriptions) {
      try {
        await webpush.sendNotification(
          item.subscription,
          payload
        );

        console.log("✅ Notification sent successfully");

      } catch (error) {
        console.log("❌ Notification error:", error.message);

        // Expired subscription delete
        if (error.statusCode === 404 || error.statusCode === 410) {
          await PushSubscription.deleteOne({
            _id: item._id,
          });

          console.log("Invalid subscription deleted");
        }
      }
    }
  } catch (error) {
    console.log("❌ Push notification failed:", error.message);
  }
};