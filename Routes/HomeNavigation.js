import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons,FontAwesome,AntDesign  } from '@expo/vector-icons'; 
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../config/colors';
import { HomeIndex } from '../Screens/Home/indexScreen';
import { HomeHeader, ProductDetailHeader } from '../Components/headerComponents';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../context/appContext';


export default function HomeNavigation(){

    const { User_Cart, User_Notifications } = useContext(AppContext)


    const Fake_profile_component = () => {
        return <View><Text>Fake Profile</Text></View>
    }

    const Fake_notificationsscreen_component = () => {
        return <View><Text>Fake Notification Screen</Text></View>
    }

    const Fake_cartscreen_component = () => {
        return <View><Text>Fake cart Screen</Text></View>
    }

    const HomeStackScreen = createBottomTabNavigator();

        return (
            <HomeStackScreen.Navigator
                initialRouteName='Home_main'
                tabBar={ ({navigation}) => {

                  let uniformSize = 22
                  let uniformColor = "gray"

                  return <View style={styles.container} >


                        <TouchableOpacity 
                              style={styles.link} 
                              onPress={() => navigation.navigate("Home_index") } >
                              <Ionicons name={'md-home'} size={uniformSize} color={colors.primary} />
                              <Text style={{fontSize:10, color:colors.primary}} > Home </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                              style={styles.link} 
                              onPress={() => navigation.navigate("My Cart") } >
                                { User_Cart ?
                                  User_Cart.cart_products ?
                                  User_Cart.cart_products.length > 0 ?
                                  <View style={styles.badge} ></View>
                                    : <></>
                                   : <></>
                                 : <></> }
                              <Ionicons name="ios-cart-outline" size={uniformSize} color={uniformColor} />
                              <Text style={styles.label} > Cart </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                              style={styles.link}  
                              onPress={() => navigation.navigate("Notifications") } >
                              <FontAwesome name="bell-o" size={uniformSize} color={uniformColor} />
                              
                              { User_Notifications ? 

                                User_Notifications.status ? 
                                  <View style={[styles.badge,{
                                    right:1
                                  }]} ></View>
                                : <></>

                              : <></> }

                              <Text style={styles.label} > Notifications </Text>
                        </TouchableOpacity>


                        <TouchableOpacity 
                              style={styles.link} 
                              onPress={() => navigation.navigate("Profile_Navigation") } >
                              <AntDesign name="user" size={uniformSize} color={uniformColor} />
                              <Text style={styles.label} > Profile </Text>
                        </TouchableOpacity>

                  </View>
                } }
            >
                <HomeStackScreen.Screen  name='Home_index' component={HomeIndex} 
                  options={{
                    header: ({navigation,route}) => <HomeHeader navigation={navigation} />
                  }}
                /> 
                {/* <HomeStackScreen.Screen  name='Product Details' component={HomeIndex} 
                  options={{
                    header: (props) => <ProductDetailHeader/>
                  }}
                />  */}
                <HomeStackScreen.Screen name='Fake_notification' component={Fake_notificationsscreen_component}/>
                <HomeStackScreen.Screen name='Fake_profile' component={Fake_profile_component} />
                <HomeStackScreen.Screen name='Fake_cart' component={Fake_cartscreen_component} />
            </HomeStackScreen.Navigator>
        );
      }



      const styles = StyleSheet.create({

        container:{
          flexDirection:"row",
          padding:10,
          justifyContent:'space-around',
          backgroundColor:"white"
        },
        link:{
          alignItems:"center",
          justifyContent:"space-between", 
          paddingTop:5 
        },
        label:{
          fontSize:10, 
          color:"gray",
         fontFamily:'TitilliumWeb-Regular',
        },
        badge:{
          backgroundColor:"tomato",
          width:10,
          height:10,
          borderRadius:40,
          top:0,
          right:-10,
          position:"absolute"
        }

      })