import dbConnect from "@/lib/db";
import { Notification } from "@/models";

export async function getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
  await dbConnect();
  const query = { recipientId: userId };
  if (unreadOnly) query.isRead = false;
  const skip = (page - 1) * limit;
  const [notifications, total, unread] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ recipientId: userId, isRead: false }),
  ]);
  return { notifications, total, unread, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function markUserNotificationRead(userId, notificationId) {
  await dbConnect();
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipientId: userId },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  );
  if (!notification) throw new Error("Notification not found");
  return notification.toObject();
}

export async function markAllUserNotificationsRead(userId) {
  await dbConnect();
  const result = await Notification.updateMany(
    { recipientId: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
  return { modifiedCount: result.modifiedCount };
}
