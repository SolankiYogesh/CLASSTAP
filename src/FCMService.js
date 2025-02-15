import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';

class FCMService {
  onRegister = token => {};
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // User has permissions
          this.getToken(onRegister);
        } else {
          // User doesn't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {
        console.log('Permission rejected', error);
      });
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          // console.log("token",fcmToken)
          // onRegister(fcmToken);
        } else {
          console.log('User does not have a device token');
        }

        PushNotification.localNotificationSchedule({
          //... You can use all the options from localNotifications
          message: 'My Notification Message', // (required)
          date: new Date(Date.now() + 60 * 1000), // in 60 secs
          allowWhileIdle: false, // (optional) set notification to work while on doze, default: false

          /* Android Only Properties */
          repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
        });
      })
      .catch(error => {
        console.log('getToken rejected ', error);
      });
  };

  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.log('Request Permission rejected', error);
      });
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('Delete token error', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // Triggered when a particular notification has been received in foreground
    this.notificationListener = messaging().onNotification(notification => {
      onNotification(notification);
    });

    // If your app is in background, you can listen for when a notification
    // is clicked / tapped / opend as follows
    this.notificationOpenedListener = messaging().onNotificationOpened(
      notificationOpen => {
        if (notificationOpen) {
          const notification = notificationOpen.notification;
          onOpenNotification(notification);
          this.removeDeliveredNotification(notification);
        }
      },
    );

    // If your app is closed , you can check if it was opened by a notification
    // being clicked / tapped / opened as follows
    messaging()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          const notification = notificationOpen.notification;
          onOpenNotification(notification);
          this.removeDeliveredNotification(notification);
        }
      });

    // Triggered for data only in freground
    this.messageListener = messaging().onMessage(message => {
      onNotification(message);
    });

    //Triggerd when have new toke
    this.onTokenRefreshListener = messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken);
    });
  };

  unResiter = () => {
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
    this.onTokenRefreshListener();
  };

  buildChannel = obj => {
    return new firebase.messaging.Android.Channel(
      obj.channelId,
      obj.channelName,
      firebase.notifications.Android.Importance.High,
    ).setDescription(obj.channelDes);
  };

  buildNotification = obj => {
    // For Android
    messaging().android.createChannel(obj.channel);

    // For Android and IOS
    return (
      //.android.setAutoCancel(true)  // Auto cancel after receive notification
      new messaging.Notification()
        .setSound(obj.sound)
        .setNotificationId(obj.dataId)
        .setTitle(obj.title)
        .setBody(obj.content)
        .setData(obj.data)

        // For Android
        .android.setChannelId(obj.channel.channelId)
        .android.setLargeIcon(obj.largeIcon) // create this icon in android studio
        .android.setSmallIcon(obj.smallIcon)
        .android.setColor(obj.colorBgIcon)
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setVibrate(obj.vibrate)
    );
  };

  scheduleNotification = (notification, days, minutes) => {
    const date = new Date();
    if (days) {
      date.setDate(date.getDate() + days);
    }

    if (minutes) {
      date.setMinutes(date.getMinutes() + minutes);
    }

    messaging().scheduleNotification(notification, {
      fireDate: date.getTime(),
    });
  };

  displayNotification = notification => {
    messaging()
      .displayNotification(notification)
      .catch(error => console.log('Display Notification error', error));
  };

  removeDeliveredNotification = notification => {
    messaging().removeDeliveredNotification(notification.notificationId);
  };
}

export const fcmService = new FCMService();
