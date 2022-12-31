import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { Octicons } from '@expo/vector-icons';
import colors from "../config/colors";
import { useState,useEffect } from "react";
import Axios  from "axios";
import OrderImg from '../assets/images/delivery.png';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import { MainSpiner } from "../Components/spinnerComponents";
import { ReconnectComponent } from "../Components/ReconnectComponent";


export const MyordersScreen = ({navigation}) => {


    const [ MyOrders, setMyOrders ] = useState();
    const [ Loading, setLoading ] = useState(false);

    const GetOrders = () => {

        setLoading(true)
        Axios.get('/orders/myorders').then(
            response => {
                setMyOrders(response.data)
                setLoading(false)
            }
        ).catch( err => {
                setLoading(false)
        } )

    }

    useEffect(() => {
      
        GetOrders()

    }, [])


    return (
    
        <Root>
            <ScrollView style={{
                flex:1,
                backgroundColor:"white"
            }} >
                
                { MyOrders && !Loading ? 
                
                    MyOrders.length > 0 ? 
                    
                        MyOrders.map( (link) => {

                            var color;

                            if ( link.order_status == "unpaid" ) {
                                color="red"
                            }

                            if ( link.order_status == "delivered" ) {
                                color=colors.primary
                            }

                            if ( link.order_status == "pending" ) {
                                color="orange"
                            }

                            return <TouchableOpacity onPress={ () => navigation.navigate("Order Details",{link}) } key={link._id} style={{
                                padding:30,
                                borderBottomColor:"lightgray",
                                borderBottomWidth:1,
                                flexDirection:"row",
                                alignItems:"center"
                            }} >
                    
                                <View style={{
                                    backgroundColor:color,
                                    width:60,
                                    justifyContent:"center",
                                    alignItems:"center",
                                    borderRadius:200,
                                    height:60
                                }} >
                                    <Octicons name="package" size={30} color="white" />
                                </View>
                    
                                <View style={{
                                    marginLeft:30
                                }} >
                                    <Text style={{
                                        fontFamily:colors.fontBold,
                                        fontSize:13
                                    }} >Order {link._id}</Text>
                    
                                    <Text style={{
                                        fontFamily:colors.fontBold,
                                        fontSize:13
                                    }} >Order Status:</Text>
                    
                                    <Text style={{
                                        color:color,
                                        fontFamily:colors.fontReg
                                    }} >{link.order_status}</Text>
                    
                                </View>
                    
                            </TouchableOpacity>
                        } ) 
                    
                    :

                    <View style={{
                        justifyContent:"center",
                        alignItems:"center",
                        marginTop:"50%"
                    }} >
    
                        <Image source={OrderImg} style={{
                            width:100,
                            height:100,
                        }} /> 
    
                        <Text style={{
                            fontFamily:colors.fontBold,
                            color:"gray",
                            textAlign:"center",
                            fontSize:15
                        }} > You haven't ordered for any yet</Text>
    
                    </View>

                : 
                
                    <View style={{
                        justifyContent:"center",
                        alignItems:"center",
                        marginTop:"50%"
                    }} >

                        { Loading ? 
                        
                            <MainSpiner bgcolor={colors.primary} />
                        
                        : <ReconnectComponent retryFunction={ () => GetOrders() } /> }

                    </View>
                
                }

            </ScrollView>
        </Root>

);

}