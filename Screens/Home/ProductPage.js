import { Image, ScrollView, View,Text, TextInput, TouchableOpacity } from "react-native"
import colors from "../../config/colors";
import { AntDesign } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import { MainSpiner } from "../../Components/spinnerComponents";
import ImageSlider from 'react-native-image-slider';
import AppContext from "../../context/appContext";
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import Axios from "axios";



export const ProductDetailPage = ({route}) => {

    

    const { BaseUrl, UpdateUser_Cart } = useContext(AppContext)

    const [ Product, setProduct ] = useState()
    const [ Quantity, setQuantity ] = useState(0)
    const [ Loading, setLoading ] = useState(false)
    const [ AddingTocart, setAddingTocart ] = useState(false)
    


    useEffect( () => {

        setLoading(true)
        setProduct(route.params)
        setLoading(false)

    }, [route.params] )



    const incrementCounter = () => setQuantity(
        Quantity + 1
    );

    const decrementCounter = () => setQuantity(
        Quantity > 1 ? Quantity - 1 : 0
    );



    const HandleAddtoCArt = () => {



        if (Quantity < 1) {

        } else {

           setAddingTocart(true)

            const req_body = {
                product_id: Product._id,
                product_quantity: Quantity
            }

            Axios.post('/carts/cart/mycart/add_to_cart', req_body)
                .then(response => {

                    UpdateUser_Cart(response.data)
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Item was Added',
                        textBody: "Item was successfully Added",
                    })
                    setAddingTocart(false)

                })
                .catch(err => {
                    Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'WARNING',
                        textBody: err.response.data,
                    })
                    setAddingTocart(false)

                })

        }

    }


    if ( !Loading && Product ) {
        

        var specialimg = []

        if (specialimg.length == 0 && Product) {
    
            for (let i = 0; i < Product.product_images.length; i++) {
    
                const currentProductimg = Product.product_images[i]
    
                specialimg.push({ uri: currentProductimg.url})
    
            }
        }


        return( 
        
                <Root> 
                    <ScrollView style={{
                    flex:1,
                    backgroundColor:"white",
                    // paddingTop:00
                    }} >
            
                        <View style={{
                            height:300
                        }} >

                                <ImageSlider
                                    loopBothSides
                                    autoPlayWithInterval={3000}
                                    images={specialimg}
                                    style={{
                                        width:"100%",
                                        height:"100%",
                                        resizeMode:"cover"
                                    }}
                                />
                
                        </View>
                
                        <View style={{
                            padding:20,
                        }} >
                
                
                            <View style={{
                                backgroundColor:colors.primary,
                                padding:6,
                                width:"23%",
                                borderRadius:5
                            }} >
                                <Text style={{
                                    color:"white",
                                    fontFamily:colors.fontReg,
                                    textAlign:"center"
                                }} >Fast Delivery</Text>
                            </View>
                
                
                            <View style={{
                                flexDirection:"row",
                                justifyContent:"space-between",
                                marginTop:20
                            }} >
                                <Text style={{
                                    fontFamily:colors.fontBold,
                                    fontSize:25
                                }} >{Product.product_name}</Text>
                
                                <Text style={{
                                    fontFamily:colors.fontBold,
                                    color:colors.primary,
                                    fontSize:25
                                }} >₦{Product.product_price} </Text>
                            </View>
                
                            <Text style={{
                                marginTop:20,
                                fontFamily:colors.fontReg,
                                color:"gray",
                                fontSize:16
                            }} >{Product.product_description}
                            </Text>
                
                            <View style={{
                                flexDirection:"row",
                                marginTop:90,
                                alignItems:"center",
                                justifyContent:"center"
                            }} >
                                
                                <TouchableOpacity onPress={ () => incrementCounter() } style={{
                                    backgroundColor:colors.primary,
                                    padding:9,
                                    borderRadius:8,
                                }} >
                                    <AntDesign name="plus" size={17} style={{
                                    }} color="white" />
                                </TouchableOpacity>

                                    <Text style={{
                                        textAlign:"center",
                                        marginLeft:10,
                                        marginRight:10,
                                        fontSize:15,
                                        padding:15,
                                    }} >
                                        {Quantity}
                                    </Text>
                                <TouchableOpacity onPress={ () => decrementCounter() } style={{
                                    backgroundColor:colors.primary,
                                    padding:9,
                                    borderRadius:8,
                                }} >
                                    <AntDesign name="minus" size={17} style={{
                                    }} color="white" />
                                </TouchableOpacity>
                            </View>
                
                            <TouchableOpacity disabled={AddingTocart} onPress={ () => HandleAddtoCArt() } style={{
                                marginTop:30,
                                backgroundColor:colors.primary,
                                padding:20,
                                borderRadius:10
                            }} >
                                { AddingTocart ? <MainSpiner bgcolor={"white"} /> : 
                                
                                <Text style={{
                                    textAlign:"center",
                                    color:"white",
                                    fontSize:18,
                                    fontFamily:colors.fontReg
                                }} >Add to cart</Text>
                                
                                }
                            </TouchableOpacity>
                
                        </View>
            
                    </ScrollView>
                </Root>
        )
    }else{

        if ( Loading && !Product ) {
            return <ScrollView contentContainerStyle={{
                justifyContent:"center",
                alignItems:"center"
            }} style={{
                flex:1,
                backgroundColor:"white",
                // paddingTop:00,
            }} >
                <MainSpiner bgcolor={colors.primary} />
            </ScrollView>
        }

    }

}