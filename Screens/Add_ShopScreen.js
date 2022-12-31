import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, Modal ,View} from 'react-native';
import UserImage from '../assets/images/man.png';
import { MaterialIcons, EvilIcons  } from '@expo/vector-icons'; 
import { useContext, useEffect, useState } from 'react';
import AppContext from '../context/appContext';
import colors from '../config/colors';
import { CalltoactionButton, LoginDetailsComponents } from '../Components/inputComponents';
import { MainSpiner } from '../Components/spinnerComponents';
import Axios from 'axios';
import { checkForCameraRollPermission } from '../utility/NewImagePicker';
import * as ImagePicker from 'expo-image-picker';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import SelectList from 'react-native-dropdown-select-list';



export default function AddShopScreen({navigation}){

    const {UserShop,setUserShop} = useContext(AppContext)

    const [ ShopDetails, setShopDetails ] = useState({
        shop_name:"",
        shop_description:"",
        shop_country:"Nigeria",
        shop_state:"",
        shop_lga:"",
        shop_address:"",
        shop_email:"",
        shop_phone_number:"",
    })

    const [ Loading, setLoading ] = useState(false)


    const SubmitShopDetails = () => {

        setLoading(true)

        const DataToSubmit = {
            shop_name:ShopDetails.shop_name,
            shop_description:ShopDetails.shop_description,
            shop_description:ShopDetails.shop_description,
            shop_country: ShopDetails.shop_country,
            shop_state: ShopDetails.shop_state,
            shop_lga:ShopDetails.shop_lga,
            shop_address:ShopDetails.shop_address,
            shop_email:ShopDetails.shop_email,
            shop_phoneNumber:ShopDetails.shop_phone_number,
        }

        Axios.post('/shops/add_shop',DataToSubmit).then(

            response => {
                setLoading(false)
                setUserShop([response.data])
                navigation.navigate("My_Shop_Home")
            }

        ).catch(

            err => {
                setLoading(false)
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'WARNING',
                    textBody: err.response.data,
                  })
            }

        )

    }


    return (

            <Root>

                <ScrollView contentContainerStyle={{
                    alignItems: 'center',
                }} style={styles.container} >

                    <View style={{
                        width:"100%",
                    }} >


                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Shop Name"}
                            value={ShopDetails.shop_name}
                            onChange={ (e) => setShopDetails({
                                ...ShopDetails,
                                shop_name:e
                            }) }
                        />

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Shop Description"}
                            lines={8}
                            value={ShopDetails.shop_description}
                            onChange={ (e) => setShopDetails({
                                ...ShopDetails,
                                shop_description:e
                            }) }
                        />

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Country"}
                            value={ShopDetails.shop_country}
                            onChange={ (e) => setShopDetails({
                                ...ShopDetails,
                                shop_country:e
                            }) }
                        />    

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"State"}
                            value={ShopDetails.shop_state}
                            onChange={ (e) => setShopDetails({
                                ...ShopDetails,
                                shop_state:e
                            }) }
                        />  

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Lga"}
                            value={ShopDetails.shop_lga}
                            onChange={ (e) => setShopDetails({
                                ...ShopDetails,
                                shop_lga:e
                            }) }
                        /> 

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Shop Address"}
                            value={ShopDetails.shop_address}
                            onChange={ (e) => setShopDetails({
                                ...ShopDetails,
                                shop_address:e
                            }) }
                        /> 

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Email"}
                            value={ShopDetails.shop_email}
                            onChange={ (e) => setShopDetails({
                                ...ShopDetails,
                                shop_email:e
                            }) }
                        />            

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Phone Number"}
                            value={ShopDetails.shop_phone_number}
                            onChange={ (e) => setShopDetails({
                                ...ShopDetails,
                                shop_phone_number:e
                            }) }
                        />  

                        <CalltoactionButton
                            text={"Create Shop"}
                            loading={ Loading }
                            onPress={ () => SubmitShopDetails() }
                        />

                        <View style={{
                            marginBottom:50
                        }} ></View>

                    </View>

                </ScrollView>

                {/* <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                    }}
                >

                    <View style={styles.centeredView}>

                        <View style={styles.modalView}>
                            
                            <TouchableOpacity style={{
                                alignSelf:"flex-end"
                            }} onPress={ () => setModalVisible(false) } >
                                <EvilIcons name="close" size={24} color="black" />
                            </TouchableOpacity>


                            <LoginDetailsComponents
                                bgcolor={colors.specialGray}
                                label={"Category Name"}
                            />    

                            <LoginDetailsComponents
                                bgcolor={colors.specialGray}
                                label={"Category Description"}
                            />            


                            <CalltoactionButton
                                text={"Add Category"}
                                // loading={ activity }
                                onPress={ () => HandleProfileUpdate() }
                            />

                        </View>


                    </View>

                </Modal> */}

            </Root>

    );

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
    centeredView: {
        flex: 1,
        marginTop: 22,
        backgroundColor:"rgba(2, 2, 2, 0.59)",
        justifyContent:"center",
        alignItems:"center"
      },
      modalView: {
          padding:30,
          position:"absolute",
          alignItems:"center",
          backgroundColor:"white",
          width:"100%",
          bottom:0,
          borderTopLeftRadius:10,
          borderTopRightRadius:10,
      },

})