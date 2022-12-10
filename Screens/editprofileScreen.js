import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserImage from '../assets/images/man.png';
import { MaterialIcons  } from '@expo/vector-icons'; 
import { useContext, useEffect, useState } from 'react';
import AppContext from '../context/appContext';
import colors from '../config/colors';
import { CalltoactionButton, LoginDetailsComponents } from '../Components/inputComponents';
import { MainSpiner } from '../Components/spinnerComponents';
import Axios from 'axios';
import { checkForCameraRollPermission } from '../utility/NewImagePicker';
import * as ImagePicker from 'expo-image-picker';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';


export default function EditProfileScreen(){

    const { User_details, setUser_details, BaseUrl } = useContext(AppContext)

    const [ user, setuser ] = useState()
    const [ imageLoading, setimageLoading ] = useState(false)
    const [ activity, setactivity ] = useState(false)

    useEffect( () => {
        setuser(User_details)

    }, [User_details] )

    const ProfilePictureUpload = async () => {

        setimageLoading(true)
        const isallowed = checkForCameraRollPermission()

        if ( isallowed ) {
            let _image = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
              });
          
              if (!_image.cancelled) {

                let localUri = _image.uri

                let filename = localUri.split('/').pop();
          
                let match = /\.(\w+)$/.exec(filename);
          
                let type = match ? `image/${match[1]}` : `image`
          

                const FordItSha = new FormData();

                FordItSha.append('profile_picture',{ uri: localUri, name: filename, type})
                FordItSha.append('category',"rice")


                Axios({
                    method: "put",
                    url: "/users/" + user._id,
                    data: FordItSha,
                    headers: { "Content-Type": "multipart/form-data", "boundry": "boundry" }
                  }).then((response) => {
              
                        setUser_details(response.data)
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Profile Picture Updated',
                            textBody: 'Your Profile Picture were Successfully Updated',
                        })
                        setimageLoading(false)
              
              
                  }).catch((err) => {
              
                    setimageLoading(false)
              
                    if (err.response) {
                        Toast.show({
                            type: ALERT_TYPE.WARNING,
                            title: 'Warning',
                            textBody: 'An error occured while trying to update your profile picture',
                        })
                    }
              
                  })
          
              }else{
                setimageLoading(false)
              }
        }else{
            setimageLoading(false)
        }

    }

    const HandleProfileUpdate = () => {

        setactivity(true)

        const bodyTosend = new FormData()

        bodyTosend.append("full_name",user.full_name)
        bodyTosend.append("phone_number",user.phone_number)
        bodyTosend.append("username",user.username)
        bodyTosend.append("email",user.email)

        Axios({
            method: "put",
            url: "/users/" + user._id,
            data: bodyTosend,
            headers: { "Content-Type": "multipart/form-data", "boundry": "boundry" }
        }).then(

            response => {
                setactivity(false)
                setUser_details(response.data)
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Profile Updated',
                    textBody: 'Your Profile Details were Successfully Updated',
                })
            }

        ).catch( (err) => {

            setactivity(false)
            if(err.response){
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Warning',
                    textBody: 'An error occured while trying to update your profile',
                })
            }
            // console.log(err)

        } )

    }

    if ( user ) {
        return(

                <Root>

                <ScrollView contentContainerStyle={{
                    alignItems: 'center',
                }} style={styles.container} >
                    
                    { !imageLoading ? <Image 
                        source={ user.profile_image.url ? {uri:user.profile_image.url} : UserImage } 
                        style={styles.image_pic} 
                    /> :
                    <View style={[styles.image_pic,{
                        backgroundColor:"white",
                        borderRadius:200
                    }]} >
                        <MainSpiner bgcolor={"gray"} />
                    </View>}
                    <TouchableOpacity style={styles.img_e} onPress={
                        () => ProfilePictureUpload()
                    } >
                        <MaterialIcons name='camera-alt' style={styles.editimage} size={27} color="white" />
                    </TouchableOpacity>

                    <View style={{
                        width:"100%",
                        marginTop:45
                    }} >


                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Full Name"}
                            value={user.full_name}
                            onChange={(e) => setuser({
                              ...user,
                              full_name: e
                            })}
                        />

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Email Address"}
                            value={user.email}
                            onChange={(e) => setuser({
                              ...user,
                              email: e
                            })}
                        />

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Username"}
                            value={user.username}
                            onChange={(e) => setuser({
                              ...user,
                              username: e
                            })}
                        />    

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Phone Number"}
                            value={user.phone_number}
                            onChange={(e) => setuser({
                              ...user,
                              phone_number: e
                            })}
                        />            


                        <CalltoactionButton
                            text={"Update Profile"}
                            loading={ activity }
                            onPress={ () => HandleProfileUpdate() }
                        />

                        <View style={{
                            marginBottom:50
                        }} ></View>

                    </View>

                </ScrollView>
                </Root>

        );
    }

    else if(!user){
        return <MainSpiner/>
    }

    return;

} 



const styles = StyleSheet.create({

    container:{
        flex: 1,
        padding:30,
        backgroundColor:"white"
    },
    image_pic:{
        width:150,
        height:150,
        borderRadius:200,
        borderColor:colors.primary,
        borderWidth:3
    },
    editimage:{
        padding:10,
    },
    img_e:{
        borderRadius:200,
        marginTop:-34,
        marginLeft:70,
        borderColor:"white",
        backgroundColor:colors.primary,
        borderWidth:3
    },

})