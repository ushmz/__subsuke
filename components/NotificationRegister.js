import Notifications from 'expo';
import * as Permissions from 'expo-permissions';

export default async function registerForPushNotificationsAsync() {

  const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';

  const { status: existingStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  };

  if (finalStatus !== 'granted') {
    alert('No notification permissions!');
    return;
  };

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
      user: {
        username: 'rabhareit',
      },
    }),
  });
};
