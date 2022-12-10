import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './Routes/AppNavigation';
import AuthNavigation from './Routes/AuthNavigation';
import { useFonts } from 'expo-font';
import Axios from 'axios';
import AppContext from './context/appContext';
import * as SecureStore from 'expo-secure-store';
// import * as Location from 'expo-location';
import Logo from './assets/images/agrico.png';
import {BASEURL} from '@env'
import { ReconnectComponent } from './Components/ReconnectComponent';



export default function App() {

  const [User, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [Error, setError] = useState(false);
  const [User_cart, setUser_cart] = useState();
  const [UserShop, setUserShop] = useState();
  const [ProductsToDisplay,setProductsToDisplay] = useState()
  const [GenRefresh,setGenRefresh] = useState(false)
  const [ UserNotifications, setUserNotifications ] = useState()


    // get User Notification
    
    const GetUserNotification = () => {
      Axios.get('/notification/')
      .then( (response) => setUserNotifications(response.data)  ) 
      .catch( err => {
          // console.log(err)
      } )
    }

    // to check if the person is loggedin In the firstPlace

    const HandleIfUserIsTrullyAuthenticated = async () => {
      

      let token = await SecureStore.getItemAsync("authToken");
      if (token) {
  
        Axios.defaults.headers.common['token'] = 'Bearer ' + token
        Axios.get('/returnUser/get_user').then(response => {

            const { cart, ...others } = response.data
            setUser({ ...others })
            setUser_cart(cart)
            GetUserNotification()
            setIsReady(true)
            setError(false)

          }).catch((error) => {
            setIsReady(true)
            setError(true)
            setUser()
            setUser_cart()
          })
  
      } else {
        
        setIsReady(true)
        setError(false)
        setUser()
        setUser_cart()
        setUserShop()
      }
  
    }


  useEffect( () => {

     HandleIfUserIsTrullyAuthenticated()

  },[] )


  const BaseUrl = BASEURL; 

//  const BaseUrl = "http://192.168.43.81:5001/"
// 
  Axios.defaults.baseURL = BaseUrl; 




    // Login Process

    async function saveToken(key, value, user_details, cart) {
      await SecureStore.setItemAsync(key, value);
      Axios.defaults.headers.common['token'] = 'Bearer ' + value
      GetUserNotification()
      setUser(user_details)
      setUser_cart(cart)
    }



      // Log out function
      const LogoutProcess = async () => {

        await SecureStore.setItemAsync("authToken", "");
        Axios.defaults.headers.common['token'] = ''
        setUser()
        setUser_cart()
        setUserNotifications()
      }


      const HandlesetUser_Details = (details) => {
        setUser(details)
      }





      const HandleUpdateUserCart = (cart_details) => {
        setUser_cart(cart_details)
      }


      // Update The Product List

      const UpdateProductLIst = (products) => {

        setProductsToDisplay(products)

      }





  const [TitilliumWeb_Regular] = useFonts({
    'TitilliumWeb-Regular': require('./assets/fonts/titi/TitilliumWeb-Regular.ttf'),
    'TitilliumWeb-SemiBold': require('./assets/fonts/titi/TitilliumWeb-SemiBold.ttf'),
  });

  const [TitilliumWeb_Bold] = useFonts({
    'TitilliumWeb-Bold': require('./assets/fonts/titi/TitilliumWeb-Bold.ttf'),
  });


  if (!TitilliumWeb_Regular || !TitilliumWeb_Bold ) {
    return null;
  }


  if ( !isReady ){
    return <View style={{
      flex:1,
      backgroundColor:"white",
      justifyContent:"center",
      alignItems:"center"
    }} >
  
        <Image source={Logo} style={{
          width:240,
          height:240
        }}  />
  
    </View>
  } 

  if ( isReady && !Error ) {
    return (
      <AppContext.Provider value={{
              BaseUrl: BaseUrl,
              User_details: User,
              LogOut: LogoutProcess,
              LogIn: saveToken,
              UpdateUser_Cart: HandleUpdateUserCart,
              User_Cart: User_cart,
              setUser_details: HandlesetUser_Details,
              DisplayProducts:ProductsToDisplay,
              UpdateDisplayProducts:UpdateProductLIst,
              UserShop:UserShop,
              setUserShop: (data) => setUserShop(data),
              GenRefresh:GenRefresh,
              setGenRefresh:() => setGenRefresh(!GenRefresh),
              User_Notifications: UserNotifications,
              setUser_Notifications: (data) => setUserNotifications(data)
            }} >
        <NavigationContainer>
              <StatusBar backgroundColor={"gray"} />
              <SafeAreaView style={{
                flex:1
              }} >
              { !isReady ? <ActivityIndicator color={"green"} /> : 
              User ? <AppNavigation/> : <AuthNavigation/> 
              }
              </SafeAreaView>
        </NavigationContainer>
      </AppContext.Provider>
  
    );
  }


  if ( isReady && Error ) {
    return <ReconnectComponent retryFunction={ () => HandleIfUserIsTrullyAuthenticated() } />
  }


}
