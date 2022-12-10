import Axios from "axios";
import { useEffect, useState } from "react";
import { Image, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import OtpImage from '../assets/images/otp.png';
import { CalltoactionButton } from "../Components/inputComponents";
import colors from "../config/colors";
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';

export const OtpScreen = ({route,navigation}) => {

    const [ isLoading, setisLoading ] = useState(false)
    const [ UserData, setUserData ] = useState()
    const [ Code, setCode ] = useState('')
    const [ Countdown, setCountdown ] = useState(600000)


    const PostOtp = (details) => {

        Axios.post('/otp/',{user_id:details._id})
            .then( (response) => {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: "A verification code has been sent to your email",
                })
                setCountdown(600000)
            } )
            .catch( err => {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Warning',
                    textBody: "Something went wrong while trying to send the code to your mail",
                })
            } )

    }

    useEffect( () => {

        // console.log(route.params)
        setUserData(route.params)
        PostOtp(route.params)

    } , [route.params] )



    const HandleVerifyToken = () => {

        setisLoading(true)

        if ( Code.length < 4 ){
            setisLoading(false)
            return
        }

        Axios.put('/otp/verify_token',{user_id:UserData._id,otp:Code})
            .then( (response) => {

                setisLoading(true) 
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Verification Successfull',
                    textBody: 'Your Account has now been verified',
                    button: 'Login',
                    onPressButton: () => {
                      navigation.navigate("LoginPage")
                    }
                  })

                  setTimeout(() => {
                    navigation.navigate("LoginPage")
                  }, 2000);

            } )
            .catch( (err) => {
                setisLoading(false)
                if ( err.response ) {
                    
                    if ( err.response.data ) {
                        Toast.show({
                            type: ALERT_TYPE.WARNING,
                            title: 'Warning',
                            textBody: err.response.data,
                        })
                    }

                } else{
                    Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'Warning',
                        textBody: "Something went wrong while trying to validate your code",
                    })
                }

            } )

    }

    setTimeout(() => {
        
        if ( Countdown < 1000 ) {
            // return 
        }else{
            setCountdown( Countdown - 1000 )
        }

    }, 1000);

    const minn = Math.floor(Countdown / 60000) % 60;
    const secc = Math.floor(Countdown / 1000) % 60;

    return (

        <Root>

            <View style={{
                    flex:1,
                    padding:30,
                    backgroundColor:"white"
                }} >
                    <StatusBar backgroundColor={colors.primary} />
                    
                    <Image source={OtpImage} style={{
                        width:140,
                        height:140,
                        marginTop:120,
                        alignSelf:"center"
                    }} />

                    <Text style={{
                        textAlign:"center",
                        marginTop:40,
                        fontFamily:colors.fontReg,
                        fontSize:18
                    }} >
                        An email with your verification code was sent to <Text style={{fontFamily:colors.fontBold}} >{ UserData ? UserData.email : ""}</Text>
                    </Text>

                    <TextInput keyboardType="phone-pad" style={{
                                alignSelf:"center",
                                marginTop:40,
                                backgroundColor:"lightgray",
                                width:"35%",
                                padding:10,
                                fontSize:25,
                                fontFamily:colors.fontBold,
                                textAlign:"center",
                            }} 
                        value={Code}
                        maxLength={4}
                        onChangeText={ (event) => {
                            setCode(event)
                        } }  />

                    <Text style={{
                        textAlign:"center",
                        marginTop:30,
                        fontSize:18,
                        fontFamily:colors.fontReg
                    }} > Resend code in: <Text style={{
                        fontFamily:colors.fontBold,
                        color:colors.primary
                    }} >{minn}:{secc}</Text> </Text>

                    { Countdown < 1000 ?
                    <CalltoactionButton loading={isLoading} onPress={ () => PostOtp(UserData) } text={"Resend Code"} styles={{
                        position:"absolute",
                        bottom:10,
                        left:30
                    }} />
                    : <CalltoactionButton loading={isLoading} onPress={ () => HandleVerifyToken() } text={"Verify Account"} styles={{
                        position:"absolute",
                        bottom:10,
                        left:30
                    }} /> }

                </View>

        </Root>

    )

}