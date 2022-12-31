import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, Modal ,View} from 'react-native';
import UserImage from '../assets/images/picture.png';
import { MaterialIcons, EvilIcons  } from '@expo/vector-icons'; 
import { useContext, useEffect, useState,useLayoutEffect } from 'react';
import AppContext from '../context/appContext';
import colors from '../config/colors';
import { CalltoactionButton, LoginDetailsComponents } from '../Components/inputComponents';
import { MainSpiner } from '../Components/spinnerComponents';
import Axios from 'axios';
import { checkForCameraRollPermission } from '../utility/NewImagePicker';
import * as ImagePicker from 'expo-image-picker';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import SelectList from 'react-native-dropdown-select-list';



export default function AddProductScreen(){

    const [ Categories, setCategories ] = useState()
    const [ isLoading, setisLoading ] = useState(false)

    const [ NewCategory, setNewCategory ] = useState({
        category_name:"",
        category_description:"",
    })

    const { UserShop, setGenRefresh } = useContext(AppContext)

    const [ ProductDetails, setProductDetails ] = useState({
        product_name:"",
        product_description:"",
        product_price:"",
        product_category:""
    })

    const [ ProductImages, setProductsImages ] = useState([
        "1",
        "2",
        "3"
    ])
    const [ modalVisible, setModalVisible ] = useState(false)

    useEffect( () => {
        
        Axios.get('/categories/').then(
            response => {
                
                var CategoryArray = []

                for (let i = 0; i < response.data.length; i++) {
                   
                    var cat = {
                        key:response.data[i].category_name,
                        value:response.data[i].category_name,
                        id:response.data[i]._id
                    }

                    CategoryArray.push(cat)
                    
                }

                setCategories(CategoryArray)
            }
        ).catch(
            err => {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Warning',
                    textBody: 'Something went wrong with fetching categories',
                  })
            }
        )

    }, [] ) 


    const PickImageTosend = async (index) => {

        const isAllowed = checkForCameraRollPermission();

        if ( isAllowed ) {

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
                
                const OldImages = ProductImages

                OldImages[index] = { uri: localUri, name: filename, type}

                setProductsImages(OldImages)

                setTimeout(() => {
                    setProductDetails({
                        ...ProductDetails,
                        product_name: ProductDetails.product_name + " "
                    })
                }, 2000);

          
              }else{
              }
        }

    }

    const THeSelected = (cat) => {

        for (let i = 0; i < Categories.length; i++) {
            
            if ( Categories[i].value == cat ) {
                setProductDetails({
                    ...ProductDetails,
                    product_category:Categories[i].id
                })
                break
            }
            
        }

    }

    const AddCategories = () => {

        setisLoading(true)
        Axios.post('/categories/add_category',NewCategory).then(

            response => {
                setModalVisible(false)
                setisLoading(false)
                setNewCategory({
                    category_name:"",
                    category_description:""
                  })
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: 'Category was successfully added',
                  })
                  var TheCategory = {
                    key:response.data[i].category_name,
                    value:response.data[i].category_name,
                    id:response.data[i]._id
                  }

                  var onldCategories = [...Categories]

                  onldCategories.push(TheCategory)

                  setCategories(onldCategories)

            }

        ).catch(
            err => {
                if (err.response) {
                    setisLoading(false)
                    Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'Warning',
                        textBody: err.response.data
                      })
                }
            }
        )

    }

    const HandleProductPost = () => {

        setisLoading(true)
        const FordItSha = new FormData();

        for (let i = 0; i < ProductImages.length; i++) {
            
            var ImageIt = ProductImages[i]
            var type = ProductImages[i].type

            FordItSha.append('product_images',{ uri: ImageIt.uri, name: ImageIt.name, type})

        }


        FordItSha.append('product_name',ProductDetails.product_name)
        FordItSha.append('product_description',ProductDetails.product_description)
        FordItSha.append('product_price',ProductDetails.product_price)
        FordItSha.append('product_category',ProductDetails.product_category)


        Axios({
            method:"post",
            url:'/shops/shop/' + UserShop[0]._id + '/add_product',
            data:FordItSha,
            headers:{ "Content-Type": "multipart/form-data", "boundry": "boundry" }
        }).then(

            (response) => {
                setisLoading(false)
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: 'Your product was successfully uploaded',
                })
                setProductDetails({
                    product_category:"",
                    product_description:"",
                    product_name:"",
                    product_price:""
                })
                setGenRefresh()
                setProductsImages([
                    "1",
                    "2",
                    "3"
                ])
            }

        ).catch(
            function (error) {
                setisLoading(false)
                console.log(error.response)
                if (err.response) {
                    Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'Warning',
                        textBody: err.response,
                    })
                }

            }

        )

        // const MAkeRequest = async () => {

        //     try {
        //         const res = await Axios({
        //             method:"post",
        //             url:'/shops/shop/' + UserShop[0]._id + '/add_product',
        //             data:FordItSha,
        //             headers:{ "Content-Type": "multipart/form-data", "boundry": "boundry" }
        //         })
        //         console.log(res.data)
        //     } catch (err) {
        //         if(err.response){
        //             console.log(err.response.data);
        //             console.log(err.response.status);
        //             console.log(err.response);
        //         }else if (err.request) {
        //             // The client never received a response, and the request was never left
        //             console.log(err.request);
        //         }else {
        //             // Anything else
        //             console.log('Error', err.message);
        //         }
        //         setisLoading(false)
        //     }

        // }

        // MAkeRequest()

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
                            label={"Product Name"}
                            value={ProductDetails.product_name}
                            onChange={ (e) => setProductDetails({
                                ...ProductDetails,
                                product_name:e
                            }) }
                        />

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Product Description"}
                            lines={8}
                            value={ProductDetails.product_description}
                            onChange={ (e) => setProductDetails({
                                ...ProductDetails,
                                product_description:e
                            }) }
                        />

                        <Text style={{
                            marginTop:40,
                            marginBottom:20,
                            fontFamily:colors.fontBold,
                            fontSize:18
                        }} > Product Images </Text>

                        <View style={{
                            flexDirection:"row",
                            justifyContent:"space-between"
                        }} >

                            { ProductImages.map( ( img, index ) => {

                                return <View key={index} style={{
                                            width:90,
                                            // borderRadius:400,
                                            height:90,
                                            justifyContent:"center",
                                            alignItems:"center"
                                        }} >
    
                                            <ImageBackground
                                                source={ img.uri ? {uri:img.uri} : UserImage }
                                                resizeMode={"cover"}
                                                style={{
                                                    width:"100%",
                                                    height:"100%",
                                                    justifyContent:"center",
                                                    alignItems:"center",
                                                }}
                                            >
            
                                                <TouchableOpacity style={{
                                                    padding:5,
                                                    backgroundColor:"lightgray"
                                                }} onPress={ () => PickImageTosend(index) } >
                                                    <Text style={{
                                                        fontSize:8,
                                                        textAlign:"center"
                                                    }} > Add Picture </Text>
                                                </TouchableOpacity>
            
                                            </ImageBackground>
            
                                        </View>

                            } ) }

                        </View>

                        <Text style={{
                            marginTop:20,
                            fontFamily:colors.fontBold,
                            fontSize:18
                        }} > Categories </Text>

                        <SelectList setSelected={(e)=>THeSelected(e) } inputStyles={{
                            fontFamily:colors.fontReg,
                            fontSize:14,
                        }} placeholder="Select Categories" search={true} boxStyles={{
                            borderColor:"black",
                            width:"100%",
                            marginTop:20
                        }} data={ Categories } onSelect={()=>{console.log("")}} />

                        <TouchableOpacity style={{
                            alignSelf:"flex-end",
                            marginTop:10
                        }} onPress={ () => setModalVisible(true) } >
                            <Text style={{
                                color:"orange",
                                fontFamily:colors.fontReg,
                                fontSize:16
                            }} > Add Category </Text>
                        </TouchableOpacity>

                        <LoginDetailsComponents
                            bgcolor={colors.specialGray}
                            label={"Price"}
                            value={ProductDetails.product_price}
                            onChange={ (e) => setProductDetails({
                                ...ProductDetails,
                                product_price:e
                            }) }
                        />              


                        <CalltoactionButton
                            text={"Add Product"}
                            loading={ isLoading }
                            onPress={ () => HandleProductPost() }
                        />

                        <View style={{
                            marginBottom:50
                        }} ></View>

                    </View>

                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
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
                                value={NewCategory.category_name}
                                onChange={
                                    (e) => setNewCategory({
                                        ...NewCategory,
                                        category_name:e
                                    })
                                }
                            />    

                            <LoginDetailsComponents
                                bgcolor={colors.specialGray}
                                label={"Category Description"}
                                value={NewCategory.category_description}
                                onChange={
                                    (e) => setNewCategory({
                                        ...NewCategory,
                                        category_description:e
                                    })
                                }
                            />            


                            <CalltoactionButton
                                text={"Add Category"}
                                loading={ isLoading }
                                onPress={ () => AddCategories() }
                            />

                        </View>


                    </View>

                </Modal>

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