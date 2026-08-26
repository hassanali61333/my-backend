import PushSubscription from "../models/pushSubscriptionModel.js";

export const saveSubscription = async (req, res) => {
  try {
    const { userID, subscription } = req.body;

    if (!userID || !subscription) {
      return res.status(400).json({
        success: false,
        message: "userID and subscription are required",
      });
    }

    const existingSubscription = await PushSubscription.findOne({
      userID,
      "subscription.endpoint": subscription.endpoint,
    });

    if (existingSubscription) {
      existingSubscription.subscription = subscription;
      await existingSubscription.save();

      return res.json({
        success: true,
        message: "Subscription updated successfully",
      });
    }

    const newSubscription = await PushSubscription.create({
      userID,
      subscription,
    });

    res.status(201).json({
      success: true,
      message: "Subscription saved successfully",
      data: newSubscription,
    });
  } catch (error) {
    console.error("Save subscription error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};