import { ScrollView, Text,View,Image, TouchableOpacity,Alert, Modal,StyleSheet } from "react-native"
import GabiImage from '../assets/images/gabi.png';
import colors from "../config/colors";
import { MaterialCommunityIcons} from '@expo/vector-icons';
import { useContext, useState,useEffect } from "react";
import AppContext from "../context/appContext";
import Axios from "axios";
import { MainSpiner } from "../Components/spinnerComponents";
import { ReconnectComponent } from "../Components/ReconnectComponent";


export const OrderDetailScreen = ({route}) => {


    const { BaseUrl } = useContext(AppContext);

    const [ Loading, setLoading ] = useState(false)
    const [ Error, setError ] = useState(false)
    const [ Order, setOrder ] = useState()
    const [ Retry, setRetry ] = useState(false)


    useEffect(() => {
        
        setError(false)
        setLoading(true)

        if ( typeof route.params.link == "object" ) {
            setOrder(route.params.link)
            setLoading(false)
            setError(false)
            return
        }

        if ( typeof route.params.link == "string" ) {
           
            Axios.get(`/orders/order/${route.params.link}`)
                .then( (response) => {
                    setOrder(response.data)
                    setLoading(false)
                    setError(false)
                } )
                .catch( (err) => {
                    setLoading(false)
                    setError(true)
                } )

        }

    }, [route.params,Retry])
    
    var Status;
    var color;

    if ( Order ) {
       
        if ( Order.order_status === "delivered" ) {
            Status = "Delivered"
            color = colors.primary
        }

        if ( Order.order_status === "unpaid" ) {
            Status = "Unpaid"
            color = "red"
        }

        if ( Order.order_status === "in-transit" ) {
            Status = "In Transit"
            color = "blue"
        }

        if ( Order.order_status === "pending" ) {
            Status = "Pending"
            color = "orange"
        }
        
    }

    return <ScrollView contentContainerStyle={{
    }} style={{
        flex:1,
        backgroundColor:"white",
    }}>
        

        { Order ?
        
        <>

        { Order.order_items.map( (item,index) => {
            return <View key={index} style={{
                padding:20,
                borderTopColor:"lightgray",
                borderTopWidth:1,
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
                    <Text style={{
                        fontFamily:colors.fontBold,
                        fontSize:18
                    }} >{item.product.product_name}</Text>
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

                            <Text style={{
                                fontFamily:colors.fontBold,
                                fontSize:17
                            }} >Quantity:</Text>

                            <Text style={{
                                marginLeft:5,
                                fontFamily:colors.fontReg,
                                fontSize:17
                            }} >{item.quantity}</Text>

                        </View>

                    </View>

                </View>

                    </View>
        } ) }


        <View style={{
            marginTop:40,
            padding:30,
            borderTopColor:"lightgray",
            borderTopWidth:1,
            borderBottomColor:"lightgray",
            borderBottomWidth:1,
        }} >

            <View style={{
                flexDirection:"row",
                alignItems:"center",
                marginBottom:10
            }} >
                <MaterialCommunityIcons name="home-circle" size={30} color={colors.orange} />
                <Text style={{
                    fontFamily:colors.fontBold,
                    fontSize:20,
                    marginLeft:14
                }} >My Address </Text>

            </View>

            <Text style={{
                fontFamily:colors.fontReg,
                fontSize:20
            }} >
                {Order.order_address}
            </Text>

            <Text style={{
                fontFamily:colors.fontReg,
                fontSize:20,
                marginTop:5
            }} >
                {Order.order_state}, {Order.order_city}
            </Text>

            <Text style={{
                fontFamily:colors.fontReg,
                fontSize:20,
                marginTop:5
            }} >
                Nigeria
            </Text>

        </View>

        <View style={{
            // marginTop:0,
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
                }} >Number of Items :</Text>
                <Text style={{
                    fontFamily:colors.fontBold,
                    fontSize:18
                }} >{Order.order_items.length}(s)</Text>
            </View>

            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                marginTop:20
            }} >
                <Text style={{
                    fontFamily:colors.fontReg,
                    fontSize:18
                }} >Delivery Fee :</Text>
                <Text style={{
                    fontFamily:colors.fontBold,
                    fontSize:18
                }} >₦{Order.order_delivery_fee}</Text>
            </View>

            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                marginTop:20
            }} >
                <Text style={{
                    fontFamily:colors.fontReg,
                    fontSize:18
                }} >Item Total Cost:</Text>
                <Text style={{
                    fontFamily:colors.fontBold,
                    fontSize:18,
                    color:colors.primary
                }} >₦{Order.order_price}</Text>
            </View>

            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                marginTop:20
            }} >
                <Text style={{
                    fontFamily:colors.fontReg,
                    fontSize:18
                }} >Delivery Date:</Text>
                <Text style={{
                    fontFamily:colors.fontBold,
                    fontSize:18
                }} >{ Order.delivery_date ? Order.delivery_date : "next one hour" }</Text>
            </View>

            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                marginTop:20
            }} >
                <Text style={{
                    fontFamily:colors.fontReg,
                    fontSize:18
                }} >Total</Text>
                <Text style={{
                    fontFamily:colors.fontBold,
                    fontSize:18,
                    color:colors.primary
                }} >₦{Order.order_price + Order.order_delivery_fee }</Text>
            </View>

            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                marginTop:20
            }} >
                <Text style={{
                    fontFamily:colors.fontReg,
                    fontSize:18
                }} >Order Status :</Text>
                <Text style={{
                    fontFamily:colors.fontBold,
                    fontSize:18,
                    color:color
                }} >

                    { Status }

                </Text>
            </View>

            {/* <CalltoactionButton text={"Pay $88.00"} /> */}

        </View>
        </>

        
        : Loading && !Error ? 
        
                <View style={{
                    marginTop:70
                }} >
                    <MainSpiner bgcolor={colors.primary} />
                </View>

        : <View style={{
            marginTop:70
        }} >
            <ReconnectComponent retryFunction={ () => setRetry(!Retry) } />
        </View> }

    </ScrollView>

}
