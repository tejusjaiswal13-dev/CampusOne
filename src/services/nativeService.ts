import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import type { InAppNotification, Notice } from "../types";

export async function shareNotice(notice: Notice) {
  const text = `${notice.title}\n\n${notice.description}${notice.deadline ? `\nDeadline: ${notice.deadline}` : ""}`;
  if (Capacitor.isNativePlatform())
    await Share.share({ title: notice.title, text });
  else if (navigator.share)
    await navigator.share({ title: notice.title, text });
  else {
    await navigator.clipboard.writeText(text);
  }
}

export async function configureReminders(
  userId: string,
  enabled: boolean,
  notices: Notice[],
  notifications: InAppNotification[],
) {
  if (!Capacitor.isNativePlatform())
    throw new Error("Device reminders are available in the Android app.");
  const pending = await LocalNotifications.getPending();
  if (!enabled) {
    await LocalNotifications.cancel({ notifications: pending.notifications });
    localStorage.removeItem(`campus-reminders:${userId}`);
    return;
  }
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== "granted")
    throw new Error("Notification permission was not granted.");
  const now = Date.now();
  const entries = notices
    .filter((n) => n.status === "APPROVED" && n.deadline)
    .map((n) => ({
      title: n.title,
      body: `Deadline: ${n.deadline}`,
      at: new Date(`${n.deadline}T09:00:00`),
    }))
    .filter((n) => n.at.getTime() > now);
  for (const n of notifications.filter(
    (n) => n.userId === userId && n.type === "APPROVAL" && !n.isRead,
  ))
    entries.push({ title: n.title, body: n.message, at: new Date(now + 5000) });
  await LocalNotifications.cancel({ notifications: pending.notifications });
  if (entries.length)
    await LocalNotifications.schedule({
      notifications: entries.slice(0, 20).map((n, i) => ({
        id: i + 1,
        title: n.title,
        body: n.body,
        schedule: { at: n.at },
        isExactNotification: false,
      })),
    });
  localStorage.setItem(`campus-reminders:${userId}`, "true");
}
export async function clearReminders() {
  if (Capacitor.isNativePlatform()) {
    const pending = await LocalNotifications.getPending();
    await LocalNotifications.cancel({ notifications: pending.notifications });
    await LocalNotifications.removeAllDeliveredNotifications();
  }
}
