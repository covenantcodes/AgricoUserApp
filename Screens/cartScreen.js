import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import CartImg from '../assets/images/cart.png';
import { AntDesign,Ionicons } from '@expo/vector-icons';
import { CalltoactionButton } from "../Components/inputComponents";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { MainSpiner } from "../Components/spinnerComponents";
import Axios from "axios";
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';



export const CartPage = ({navigation}) => {

    const { BaseUrl, User_Cart, UpdateUser_Cart } = useContext(AppContext);

    const [ Cart, setCart ] = useState();

    useEffect( () => {

        setCart(User_Cart)

    }, [ User_Cart ] )


    const UpdateCartItem = (action,index) => {

        var OldCArt = [ ...Cart.cart_products ]

        var theitemitself = OldCArt[index]

        if ( action === "plus" ) {
            theitemitself.quantity = theitemitself.quantity + 1
        }

        if ( action === "minus" ) {
            
            if ( theitemitself.quantity == 1 ) {
                theitemitself.quantity = theitemitself.quantity
            }else{
                theitemitself.quantity = theitemitself.quantity - 1
            }

        }

        theitemitself.editing = true

        OldCArt[index] = theitemitself
    
        setCart({
            ...Cart,
            cart_products:OldCArt
        })

    }

    const UpdateCartFinally = (index) => {

        var OldCArt = [ ...Cart.cart_products ]

        var theitemitself = OldCArt[index]

        const req_body = {
            product_id: theitemitself.product._id,
            product_quantity: theitemitself.quantity
        }

        Axios.post('/carts/cart/mycart/add_to_cart', req_body)
            .then(response => {

                UpdateUser_Cart(response.data)
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Item was Added',
                    textBody: "Item was successfully Updated",
                })

            })
            .catch(err => {

                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'WARNING',
                    textBody: err.response.data,
                })

            })

    }


    const RemoveFromCArtHandler = (index) => {

        var OldCArt = [ ...Cart.cart_products ]

        var theitemitself = OldCArt[index]

        const product_to_Remove = {
            product_id: theitemitself.product._id,
            product_quantity: theitemitself.quantity
        }
    
        Axios.post('/carts/cart/mycart/remove_from_cart', product_to_Remove)
          .then((response) => {
    
            UpdateUser_Cart(response.data)
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Item was Removed',
              textBody: "Item was successfully Removed",
              button: 'close',
            })
    
          }).catch((err) => {
    
            Toast.show({
              type: ALERT_TYPE.WARNING,
              title: 'WARNING',
              textBody: err.response.data,
              button: 'close',
            })
    
          })
    
      }

    return( 
    
    <Root> 
        
        <ScrollView contentContainerStyle={{
            }} style={{
                flex:1,
                backgroundColor:"white",
                // padding:30,
            }} >

        { Cart ? 
        
            Cart.cart_products.length > 0 ?
            
            <>
                {Cart.cart_products.map( (item,index) => {

                    return <View key={index} style={{
                        padding:20,
                        borderBottomColor:"lightgray",
                        borderBottomWidth:1,
                        flexDirection:"row",
                        justifyContent:"space-between"
                    }} >
                        <Image source={{
                            uri:item.product.product_images[0].url
                        }} style={{
                            width:"25%",
                            height:90,
                            borderRadius:10
                        }}  />
        
                        <View style={{
                            width:"70%",
                        }} >
                            

                            <TouchableOpacity onPress={ () => navigation.navigate("Product Details",item.product) } style={{
                                alignSelf:"flex-start"
                            }} >
                                <Text style={{
                                    fontFamily:colors.fontBold,
                                    fontSize:18
                                }} >{item.product.product_name}</Text>
                            </TouchableOpacity>

                            <Text numberOfLines={3} style={{
                                fontFamily:colors.fontReg,
                                // width:"60%",
                                fontSize:12,
                                marginTop:5
                            }} >{item.product.product_description}
                            </Text>
        
                            <View style={{
                                marginTop:10,
                                justifyContent:"space-between",
                                flexDirection:"row"
                            }} >
        
                                <Text style={{
                                    fontFamily:colors.fontBold,
                                    color:colors.primary,
                                    fontSize:18,
                                    // marginRight:100
                                }} >₦{item.product.product_price} </Text>
        
                                <View style={{
                                    flexDirection:"row",
                                    alignItems:"center"
                                }} >
                                    
                                    <TouchableOpacity onPress={ () => UpdateCartItem("plus",index) } style={{
                                        borderColor:"gray",
                                        borderWidth:1,
                                        padding:6,
                                        borderRadius:800
                                    }} >
                                        <AntDesign name="plus" size={15} color="gray" />
                                    </TouchableOpacity>
        
                                        <Text style={{
                                            textAlign:"center",
                                            marginLeft:10,
                                            marginRight:10,
                                            fontFamily:colors.fontReg,
                                            fontSize:15,
                                        }} >
                                            {item.quantity}
                                        </Text>
        
                                    <TouchableOpacity onPress={ () => UpdateCartItem("minus",index) } style={{
                                        borderColor:"gray",
                                        borderWidth:1,
                                        padding:6,
                                        borderRadius:800
                                    }} >
                                        <AntDesign name="minus" size={15} color="gray" />
                                    </TouchableOpacity>

                                    { item.editing ?
                                    
                                        <TouchableOpacity onPress={ () => UpdateCartFinally(index) } style={{
                                            backgroundColor:"green",
                                            marginLeft:10,
                                            padding:6,
                                            borderRadius:800
                                        }} >
                                            <AntDesign name="check" size={15} color="white" />
                                        </TouchableOpacity>
                                    
                                    :
                                    
                                    <TouchableOpacity onPress={ () => RemoveFromCArtHandler(index) } style={{
                                        backgroundColor:"tomato",
                                        marginLeft:10,
                                        padding:6,
                                        borderRadius:800
                                    }} >
                                        <Ionicons name="md-trash-bin" size={15} color="white" />
                                    </TouchableOpacity>

                                    }
        
                                </View>
        
                            </View>
        
                        </View>
        
                            </View>
                } ) }

                <View style={{
                    marginTop:90,
                    padding:30
                }} >

                    <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        marginTop:20
                    }} >
                        <Text style={{
                            fontFamily:colors.fontReg,
                            fontSize:18
                        }} >Number of item :</Text>
                        <Text style={{
                            fontFamily:colors.fontBold,
                            fontSize:18
                        }} >{Cart.cart_products.length} Item(s)</Text>
                    </View>

                    <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        marginTop:20
                    }} >
                        <Text style={{
                            fontFamily:colors.fontReg,
                            fontSize:18
                        }} >Total :</Text>
                        <Text style={{
                            fontFamily:colors.fontBold,
                            fontSize:18,
                            color:colors.primary
                        }} >₦{Cart.cart_total}</Text>
                    </View>

                    <CalltoactionButton onPress={() => navigation.navigate("Checkout Page")} text={"Checkout"} />

                </View>

            </>    
            
            :

                <View style={{
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
                        fontSize:18,
                        marginTop:30
                    }} >Your cart is empty</Text>

                </View>

            : <MainSpiner bgcolor={colors.primary} /> }        

        </ScrollView> 
    
    </Root>
    
    )

}