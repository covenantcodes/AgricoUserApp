import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import CartImg from '../assets/images/bell.png';
import OrderImg from '../assets/images/delivery.png';
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { MainSpiner } from "../Components/spinnerComponents";
import Axios from "axios";



export const NotificationsScreen = ({navigation}) => {

    const { setUser_Notifications,  } = useContext(AppContext);

    const [ isLoading, setisLoading ] = useState(false)
    const [ isError, setisError ] = useState(false)
    const [ Notifications, setNotifications ] = useState(null)

    const GetNotification = () => {

        setisLoading(true)
        setisError(false)

        Axios.put('/notification/update_notifications/')
        .then( (response) => {
            setUser_Notifications({...response.data})
            setisLoading(false)
            setisError(false)
            setNotifications(response.data)
        }  ) 
        .catch( err => {
            setisLoading(false)
            setisError(true)
            // console.log(err)
        } )  

    }


    useEffect( () => {
        GetNotification()
    },[] )

    if ( isLoading ) {
        return <ScrollView contentContainerStyle={{
        }} style={{
            flex:1,
            backgroundColor:"white",
            padding:30,
        }}>
            <MainSpiner bgcolor={colors.primary} />
        </ScrollView>
    }
    
    if ( isError ) {
        return <ScrollView contentContainerStyle={{
        }} style={{
            flex:1,
            backgroundColor:"white",
            padding:30,
        }}>
            <Text>Error Page</Text>
        </ScrollView>
    }

    if ( Notifications ) {
        return <ScrollView contentContainerStyle={{
        }} style={{
            flex:1,
            backgroundColor:"white",
            // padding:30,
        }}>
           
           { Notifications.user_notifications.length > 0 ? 

                Notifications.user_notifications.map( (noti,index) => {

                    var link = noti.order_id

                    const NotiDate = new Date(noti.dateCreated)
                    const UpdatedWhen = new Date(Notifications.updatedAt)

                    if ( NotiDate > UpdatedWhen ) {
                        var bg = "lightgray"
                        var icon = "white"
                    }else{
                        bg = "white"
                        icon = "lightgray"
                    }

                    return <TouchableOpacity onPress={ () => navigation.navigate("Order Details",{link}) } key={index} style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        alignItems:"center",
                        // width:"100%",
                        padding:30,
                        backgroundColor:bg,
                        borderBottomColor:"lightgray",
                        borderBottomWidth:1,
                        paddingBottom:30,
                        // marginBottom:30
                    }} >
                            
                            <View style={{
                                backgroundColor:icon,
                                padding:10,
                                borderRadius:400
                            }} >
                                <Image source={OrderImg} style={{
                                    width:30,
                                    height:30,
                                }} />
                            </View>

                            <View style={{
                                // marginLeft:20,
                                width:"80%"
                            }} >
                                <Text style={{
                                    fontFamily:colors.fontBold,
                                    fontSize:19
                                }} >Your Order </Text>
                                <Text style={{
                                    fontFamily:colors.fontReg,
                                    fontSize:15
                                }}>{noti.message}</Text>
                            </View>

                    </TouchableOpacity>
                } )

           :                 <View style={{
                                justifyContent:"center",
                                alignItems:"center",
                                marginTop:"50%"
                            }} >

                                <Image source={CartImg} style={{
                                    width:100,
                                    height:100,
                                //     borderColor:"red",
                                // borderWidth:1,
                                }} />

                                <Text style={{
                                    fontFamily:colors.fontBold,
                                    color:"gray",
                                    textAlign:"center",
                                    fontSize:19,
                                    marginTop:40
                                }} > You don't have any notification </Text>

                            </View>
            }

        </ScrollView>
    }
    

}