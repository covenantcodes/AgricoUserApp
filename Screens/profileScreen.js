import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserImage from '../assets/images/man.png';
import { Entypo,FontAwesome5,AntDesign,Ionicons,Fontisto,MaterialCommunityIcons  } from '@expo/vector-icons'; 
import { useContext, useEffect, useState } from 'react';
import AppContext from '../context/appContext';
import { MainSpiner } from '../Components/spinnerComponents';
import colors from '../config/colors';


export default function ProfileHomeScreen({navigation}){


    const {LogOut,User_details} = useContext(AppContext)
    const [ user, setuser ] = useState()

    let iconcolor = "#333"
    let iconSize = 25

    const AllTheLinks = [

        {Thelocation:"Edit Profile",
         icon:<FontAwesome5 name="user-alt" style={styles.left_ic} color={iconcolor} size={iconSize} />,
         text:"Edit Profile"},

        {Thelocation:"My Cart",
         icon:<Ionicons name="cart" style={styles.left_ic} color={iconcolor} size={iconSize} />,
         text:"My Cart"},

        {Thelocation:"Notifications",
         icon:<Fontisto name="bell-alt" style={styles.left_ic} color={iconcolor} size={iconSize} />,
         text:"Notifiactions"},

        {Thelocation:"My Orders",
         icon:<MaterialCommunityIcons name="package" style={styles.left_ic} color={iconcolor} size={iconSize} />,
         text:"My Orders"},

    ]

    useEffect( () => {

        setuser(User_details)


    },[User_details] )

    if ( user ) {
        
        return(
            <ScrollView contentContainerStyle={{
                alignItems: 'center',
            }} style={styles.container} >

                <View style={{
                    width:"100%",
                    backgroundColor:colors.primary,
                    padding:25,
                    flexDirection:"row",
                    alignItems:"center"
                }} >

                    <Image 
                        source={ user.profile_image.url ? {uri:user.profile_image.url} : UserImage } 
                        style={{
                            width:70,
                            borderRadius:200,
                            height:70,
                            borderColor:"white",
                            borderWidth:3,
                            marginRight:10
                        }} />

                    <View>
                        <Text style={{color:"white",fontFamily:"TitilliumWeb-Regular",fontSize:16}} > Welcome </Text>    
                        <Text style={{color:"white",fontFamily:"TitilliumWeb-Bold",fontSize:16}} > {user.full_name} </Text>    
                    </View>    

                </View>

                <View style={{
                    width:"100%",
                    padding:25
                }} >


                    { AllTheLinks.map( (theLink) => {

                        return  <TouchableOpacity style={styles.links} key={theLink.text} onPress={ () => navigation.navigate(theLink.Thelocation) } >
    
                                    <View style={{
                                        flexDirection:"row",
                                        alignItems:"center"
                                    }} >
                                        {theLink.icon}
                
                                        <Text style={styles.main_text} > {theLink.text} </Text> 
                
                                    </View>
                
                                    <AntDesign name='right' style={styles.right_ic} color={iconcolor} size={15} />    
                
                                </TouchableOpacity>

                    } ) }

    
                    <TouchableOpacity style={styles.links} onPress={ () => LogOut() } >
                        
                        <View style={{
                            flexDirection:"row",
                            alignItems:"center"
                        }} >
                            <MaterialCommunityIcons name="exit-run" style={styles.left_ic} color={iconcolor} size={iconSize} />
    
                            <Text style={styles.main_text} > Logout </Text> 
    
                        </View>
    
                        <AntDesign name='right' style={styles.right_ic} color={iconcolor} size={15} />    
    
                    </TouchableOpacity>
    
                    <View style={{
                        marginBottom:50
                    }} ></View>
    
                </View>
    
            </ScrollView>
        );

    }else{
        return <MainSpiner/>
    }

} 



const styles = StyleSheet.create({

    container:{
        flex: 1,
        backgroundColor:"white",
        // padding:25,
    },
    image_pic:{
        marginTop:40,
        width:150,
        height:150,
        borderRadius:200
    },
    user_fullname:{
        marginTop:20,
        fontSize:25,
        fontFamily:'TitilliumWeb-Bold',
        color:"#333"
    },
    links:{
        width:"100%",
        flexDirection:"row",
        padding:15 ,
        justifyContent:"space-between",
        alignItems:"center"
    },
    left_ic:{
        marginRight:30,
        // backgroundColor:"lightgray",
        padding:10,
        borderRadius:8
    },
    main_text:{
        fontFamily:'TitilliumWeb-Bold',
        fontSize:18,
        color:"#333"
    }

})