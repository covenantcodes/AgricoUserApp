import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import BgImage from '../assets/images/auth.jpg';
import { CalltoactionButton, LoginDetailsComponents } from "../Components/inputComponents";
import { ALERT_TYPE, Dialog, Root } from 'react-native-alert-notification';
import { useState } from "react";
import Axios from 'axios';
import colors from "../config/colors";



export default function RegisterScreen({ navigation }){

    const [UserInfo, setUserInfo] = useState({

        full_name: '',
        username: '',
        phone_number: '',
        email: '',
        password: '',
        confirmPassword: '',
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
          full_name: UserInfo.full_name.replace(' ',''),
          username: UserInfo.username.replace(' ',''),
          phone_number: UserInfo.phone_number.replace(' ',''),
          email: UserInfo.email.replace(' ',''),
          password: UserInfo.password.replace(' ',''),
          confirmPassword: UserInfo.confirmPassword.replace(' ',''),
        }
    
        Axios.post('auth/signup', SubmitDetail).then(
    
          (response) => {
            setUserInfo({
              ...UserInfo,
              iserrormessage: {
                message: '',
                status: false
              },
              isLoading: false
            })
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Registration Successfull',
              textBody: 'verify your account',
              button: 'Verify',
              onPressButton: () => {
                navigation.navigate("Otp_Page",response.data)
              }
            })

            setTimeout(() => {
              navigation.navigate("Otp_Page",response.data)
            }, 2000);
            
          }
    
        ).catch(err => {  
    
          if (err.response) {
    
            setUserInfo({
              ...UserInfo,
              iserrormessage: {
                message: err.response.data,
                status: true
              },
              isLoading: false
            })
    
            Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: 'WARNING',
              textBody: err.response.data,
              button: 'close',
            })
    
    
          }
    
        })
    
      };
    

    return  <Root>
    <ScrollView style={styles.main} >
                <ImageBackground source={BgImage} style={styles.main_2} resizeMode="cover" >
                    <Text style={styles.main_text} > Register </Text>
                    <Text style={styles.main_subtext} > Create your free account. </Text>


                    <LoginDetailsComponents
                        bgcolor={colors.specialGray}
                        label={"Full Name"}
                        placeholder={"E.g Afolabi Oluwadamilare"}
                        value={UserInfo.full_name}
                        onChange={(e) => setUserInfo({
                          ...UserInfo,
                          full_name: e
                        })}
                    />

                    <LoginDetailsComponents
                        bgcolor={colors.specialGray}
                        label={"Username"}
                        placeholder={"E.g dikins12232"}
                        value={UserInfo.username}
                        onChange={(e) => setUserInfo({
                          ...UserInfo,
                          username: e
                        })}
                    />

                    <LoginDetailsComponents
                        bgcolor={colors.specialGray}
                        label={"Email"}
                        placeholder={"E.g afolabidamilare113@gmail.com"}
                        value={UserInfo.email}
                        onChange={(e) => setUserInfo({
                          ...UserInfo,
                          email: e
                        })}
                    />

                    <LoginDetailsComponents
                        bgcolor={colors.specialGray}
                        label={"Mobile Number"}
                        placeholder={"E.g 090455566668"}
                        value={UserInfo.phone_number}
                        onChange={(e) => setUserInfo({
                          ...UserInfo,
                          phone_number: e
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

                    <LoginDetailsComponents
                        bgcolor={colors.specialGray}
                        label={"Repeat Password"}
                        placeholder={"**************"}
                        secure={true}
                        value={UserInfo.confirmPassword}
                        onChange={(e) => setUserInfo({
                          ...UserInfo,
                          confirmPassword: e
                        })}
                    />                    

                    <CalltoactionButton
                        text="Register"
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
                    }} >Already have an account?  </Text>
                    <Text
                        onPress={() => navigation.navigate("LoginPage")}
                        style={{
                        fontSize: 17,
                        color: 'green',
                        fontFamily:"TitilliumWeb-Bold"
                        }}
                    >Sign In</Text> 
                    </View>


                </ImageBackground>
           </ScrollView>
           </Root>
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