import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from "react-native";
import * as Linking from 'expo-linking'

export const useNotifications = () => {

   const registerForPushNotificationsAsync = async () => {
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          // console.log("token",token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      };

    // This listener is fired whenever a notification is received while the app is foreground
    
    const handleNotification = (notification = Notifications.Notification) => {
      // could be useful if you want to display your own toast message
      // could also make a server call to refresh data in other part of the project
    }

    // This listner is fired whenever a user taps on or interacts with a notification (works when app is foreground, background) 
      const handleNotificationResponse = ( response = Notifications.NotificationResponse ) => {
        const data = response.notification.request.content.data
        // const data: { url?: string } = response.notification.request.content.data
        console.log(data)
        if ( data.url ) Linking.openURL(data.url)
      }


      return { registerForPushNotificationsAsync, handleNotification, handleNotificationResponse }

}