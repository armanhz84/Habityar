/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility to manage and trigger standard HTML5 Web Notifications on mobile phones
 * and desktops, with advanced diagnostic support for sandboxed environment safety.
 */

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionState(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Request notification permissions from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.warn('System notifications are not supported in this browser.');
    return false;
  }

  try {
    // Some secure iframe settings block permission requests
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error('Failed to request notification permission due to sandbox restriction:', err);
    return false;
  }
}

/**
 * Displays a system/mobile push notification if permissions are active and enabled.
 * Returns true if shown via system, false if fallback should be triggered instead.
 */
export function triggerSystemNotification(title: string, body: string, iconUrl?: string): boolean {
  // Dispatch a global CustomEvent so the app can always show a beautiful in-app sliding banner fallback
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('app-push-notification', {
      detail: { title, body, iconUrl }
    });
    window.dispatchEvent(event);
  }

  if (!isNotificationSupported()) return false;
  
  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const options: any = {
      body,
      icon: iconUrl || '/logo.png',
      badge: iconUrl || '/logo.png',
      vibrate: [200, 100, 200], // vibration pattern for mobile devices
      dir: 'rtl',
      tag: 'habityar-alarm',
      requireInteraction: true, // Keep it visible until dismissed by user
    };

    // Trigger standard native alert
    new Notification(title, options);
    return true;
  } catch (err) {
    console.warn('Failed to emit browser notification. This is common inside highly secure frames:', err);
    return false;
  }
}
