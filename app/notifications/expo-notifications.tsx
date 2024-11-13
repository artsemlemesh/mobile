import { expoPushToken } from '../api';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { useSelector } from 'react-redux';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function ExpoNotification() {
  const user = useSelector((state) => state.user);
  const {
    profile,
  } = user;
  
  
  

  const [Token, setToken] = useState('');
  const [notification, setNotification] = useState<any>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  useEffect(() => {
    if (profile && Token === '') {
      registerForPushNotificationsAsync().then(token => {
        setToken(token)
        expoPushToken({
          expo_push_token: token,
          email : profile.email
        })
      });
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification({notification});
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        // TODO What we have to withthe notification
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [profile, Token]);

  return null;
}

async function registerForPushNotificationsAsync() {
  let token;
  if (true) {//Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Must use physical device for Expo Push Notifications!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}