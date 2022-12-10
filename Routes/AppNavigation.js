import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../config/colors';
import { CartDetailHeader, CustomHeader, ProductDetailHeader, SpecialHeader } from '../Components/headerComponents';
import ProfileNavigation from './ProfileNavigation';
import HomeNavigation from './HomeNavigation';
import { ProductDetailPage } from '../Screens/Home/ProductPage';
import { CartPage } from '../Screens/cartScreen';
import { CheckOutPageScreen } from '../Screens/CheckoutPage';
import { MyordersScreen } from '../Screens/MyOrdersScreen';
import { OrderDetailScreen } from '../Screens/OrderDetailScreen';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useNotifications } from '../hooks/useNotificatons';
import { NotificationsScreen } from '../Screens/notificationScreen';

export default function AppNavigation(){

  // const { handleNotification, handleNotificationResponse, registerForPushNotificationsAsync } = useNotifications()

  // useEffect( () => {
  //   registerForPushNotificationsAsync();
  //   Notifications.setNotificationHandler({
  //     handleNotification: async () => ({
  //       shouldShowAlert: true,
  //       shouldPlaySound: true,
  //       shouldSetBadge: true,
  //     }),
  //   });

  //   const responseListener = Notifications.addNotificationResponseReceivedListener(
  //     handleNotificationResponse
  //   )

  //   return () => {
  //     if ( responseListener ) {
  //       Notifications.removeNotificationSubscription( responseListener )
  //     }
  //   }

  // }, [] )


    
      const MainNavigation = createNativeStackNavigator();


      return (

        <MainNavigation.Navigator initialRouteName='Home' >
          
            <MainNavigation.Screen name='Home' component={HomeNavigation} options={{
              headerShown:false
            }} />

            <MainNavigation.Screen options={{
              header: ({navigation,route}) => <SpecialHeader navigation={navigation} title="Product Detail" />
            }} name='Product Details'  component={ProductDetailPage} />

            <MainNavigation.Screen options={{
              header: ({navigation,route}) => <SpecialHeader navigation={navigation} title="Notifications" />
            }} name='Notifications' component={NotificationsScreen} />

            <MainNavigation.Screen options={{
              header: ({navigation,route}) => <SpecialHeader navigation={navigation} title="My Cart" />
            }} name='My Cart'  component={CartPage} />

            <MainNavigation.Screen options={{
              header: ({navigation,route}) => <SpecialHeader navigation={navigation} title="Checkout" />
            }} name='Checkout Page'  component={CheckOutPageScreen} />

            <MainNavigation.Screen options={{
              header: ({navigation,route}) => <SpecialHeader navigation={navigation} title="My Orders" />
            }} name='My Orders'  component={MyordersScreen} />

            <MainNavigation.Screen options={{
              header: ({navigation,route}) => <SpecialHeader navigation={navigation} title="Order Details" />
            }} name='Order Details'  component={OrderDetailScreen} />

            <MainNavigation.Screen name='Profile_Navigation' options={{
              headerShown:false,
            }} component={ProfileNavigation} />

        </MainNavigation.Navigator>
      );

}