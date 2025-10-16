// react/hooks/usePushNotifications.ts
import { useEffect } from 'react';
import { userManager } from '../../legacy/UserManager';

export const usePushNotifications = () => {
  useEffect(() => {
    const push = PushNotification.init({
      android: { senderID: '669497320340', icon: 'noti_icon' },
      ios: { sound: true, vibration: true, badge: true },
      windows: {},
    });

    push.on('registration', data => {
      const oldRegId = localStorage.getItem('registrationId');
      if (oldRegId !== data.registrationId) {
        userManager.RegistrationId = data.registrationId;
        localStorage.setItem('registrationId', data.registrationId);
      }
    });

    push.on('error', e => console.error('push error = ' + e.message));

    push.on('notification', data => {
      navigator.notification.alert(data.message, null, data.title, 'Ok');
    });
  }, []);
};
