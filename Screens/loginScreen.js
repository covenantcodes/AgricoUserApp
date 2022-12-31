import { ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import BgImage from '../assets/images/auth.jpg';
import { CalltoactionButton, LoginDetailsComponents } from "../Components/inputComponents";
import { useState,useContext } from "react";
import AppContext from "../context/appContext";
import Axios from 'axios';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import colors from "../config/colors";



export default function LoginScreen({navigation}){


    const { LogIn, UpdateUser_Cart } = useContext(AppContext)

    const [UserInfo, setUserInfo] = useState({
  
      username: '',
      password: '',
      isLoading: false,
      iserrormessage: {
        message: '',
        status: false
      }
    })


    const handleSubmit = () => {

        setUserInfo({
          ...UserInfo,
          iserrormessage: {
            message: '',
            status: false
          },
          isLoading: true
        })
    
        const SubmitDetail = {
          username: UserInfo.username,
          password: UserInfo.password,
        }
    
        Axios.post('auth/signin', SubmitDetail).then(
    
          (response) => {

              if ( !response.data.isVerified ) {
                
                setUserInfo({
                  ...UserInfo,
                  iserrormessage: {
                    message: '',
                    status: false
                  },
                  isLoading: false
                })

                const { cart, accessToken, ...Tothers } = response.data
                navigation.navigate("Otp_Page",Tothers)
              }else{

                setUserInfo({
                  ...UserInfo,
                  iserrormessage: {
                    message: '',
                    status: false
                  },
                  isLoading: false
                })
        
                const { cart, ...others } = response.data
        
                LogIn("authToken", response.data.accessToken, { ...others }, cart)
                UpdateUser_Cart({ cart })
        
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Login Successfull',
                    textBody: 'You will be redirected to the home page',
                    button: 'Home',
                    onPressButton: () => {
                      navigation.navigate("")
                    }
                  })
    

              }


          }
    
        ).catch(err => { 

            var errprit =  err.response.data

            setUserInfo({
              ...UserInfo,
              iserrormessage: {
                message: err.response.data,
                status: true
              },
              isLoading: false
            })

          // console.log(err.response.data)

          if (  errprit.includes('timed out') ) {
            errprit = "Something went wrong, please check your internet connection"
          }

          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: 'WARNING',
            textBody:  errprit,
            button: 'close',
          })
    
        })
    
    
    
      }

    return  (

      <Root>
            <ScrollView style={styles.main} >
                <ImageBackground source={BgImage} style={styles.main_2} resizeMode="cover" >
                    <Text style={styles.main_text} > Login </Text>
                    <Text style={styles.main_subtext} > Access your Account </Text>


                    <LoginDetailsComponents
                        bgcolor={colors.specialGray}
                        label={"Username"}
                        placeholder={"E.g dikins1122"}
                        value={UserInfo.username}
                        onChange={(e) => setUserInfo({
                          ...UserInfo,
                          username: e
                        })}
                    />

                    <LoginDetailsComponents
                        bgcolor={colors.specialGray}
                        label={"Password"}
                        placeholder={"**************"}
                        secure={true}
                        value={UserInfo.password}
                        onChange={(e) => setUserInfo({
                          ...UserInfo,
                          password: e
                        })}
                    />

                    <CalltoactionButton
                        text="Login"
                        loading={UserInfo.isLoading}
                        onPress={ () => handleSubmit() }
                    />

                    <View style={{
                        width:"100%",
                        display:"flex",
                        flexDirection:"row",
                        alignItems:"center",
                        marginTop:25,
                    }}>
                    <Text style={{
                        fontFamily:"TitilliumWeb-Regular"
                    }} >Do not have an account?  </Text>
                    <Text
                        onPress={() => navigation.navigate("RegisterPage")}
                        style={{
                        fontSize: 17,
                        color: 'green',
                        fontFamily:"TitilliumWeb-Bold"
                        }}
                    >Sign up</Text> 
                    </View>

                </ImageBackground>
            </ScrollView>
           </Root>

    )

}

const styles = StyleSheet.create({

    main:{
        flex: 1,
        // justifyContent: 'center', 
        // alignItems: 'center',
        // paddingTop:100
    },

    main_2:{
        flex: 1,
        // justifyContent: 'center', 
        alignItems: 'center',
        paddingTop:150,
        padding:30
    },    

    main_text:{
        fontFamily:'TitilliumWeb-Bold',
        // fontWeight:"bold",
        fontSize:40,
        color:"#333"
    },

    main_subtext:{
         fontFamily:'TitilliumWeb-Regular',
         color:"gray",
         fontSize:16,
         marginTop:3,
         marginBottom:60
    }

})