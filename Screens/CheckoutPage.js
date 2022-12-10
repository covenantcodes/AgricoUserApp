import { ScrollView, Text,View,Image, TouchableOpacity,Alert, Modal,StyleSheet } from "react-native"
import colors from "../config/colors";
import { MaterialCommunityIcons,AntDesign,MaterialIcons } from '@expo/vector-icons';
import { CalltoactionButton, LoginDetailsComponents } from "../Components/inputComponents";
import { useContext, useEffect, useState, useRef } from "react";
import  { Paystack , paystackProps}  from 'react-native-paystack-webview';
import AppContext from "../context/appContext";
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import { MainSpiner } from "../Components/spinnerComponents";
import Axios from 'axios';
import CartImg from '../assets/images/checkout.png';
import { PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY } from '@env'


export const CheckOutPageScreen = ({navigation}) => {

    const { User_Cart, UpdateUser_Cart, User_details, setUser_Notifications, User_Notifications } = useContext(AppContext)

    const paystackWebViewRef = useRef(paystackProps.PayStackRef); 

    const [ Cart, setCart ] = useState();
    const [ Address, setAddress ] = useState({
        address:"",
        city:"",
        state:"",
        lga:""
    })
    const [ Checkingout,setCheckingout ] = useState(false)
    const [ loadingaddress,setloadingaddress ] = useState(false)
    const [ TheUser, setTheUser ] = useState()
    const [ modalVisible, setModalVisible ] = useState(false)

    useEffect( () => {

        setloadingaddress(true)

        setCart(User_Cart)

        setTheUser(User_details)

            Axios.get('/address/get_address/')
                .then( (response) => {
                        setAddress({
                        address:response.data.address,
                        city:response.data.city,
                        lga:response.data.lga,
                        state:response.data.state,
                    }) 
                    setloadingaddress(false)
                 })
                .catch( (err) => {
                    setloadingaddress(false)
                    Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'WARNING',
                        textBody: "something went wrong while fetching your address",
                      })
                } )

    }, [User_Cart,User_details] )


    const UpdateAddress = () => {

        setloadingaddress(true)

        if (
            Address.address == "" ||
            Address.city == "" ||
            Address.lga == "" ||
            Address.state == ""
        ) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'WARNING',
                textBody: "Please fill your Address",
              })
              setloadingaddress(false)
              return
        }

        Axios.put('/address/edit_address',Address)
            .then( () => {
                setloadingaddress(false)
                setModalVisible(false)
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: "Address was successfully updated",
                  })
            } )
            .catch( err => {

                setloadingaddress(false)
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'WARNING',
                    textBody: "something went wrong while updating your address",
                  })

            } )

    }

    const GetDeliveryDate = () => {
    
        var TheDate = new Date()
        TheDate.setDate( TheDate.getDate() - 1)
        // TheDate.setHours( TheDate.getHours() + 9 )
    
        var hourmark = TheDate.getHours()
        var min = TheDate.getMinutes()
        var day = TheDate.getDay()
        var month = TheDate.getMonth()
        var year = TheDate.getFullYear() 
    
    
        if( hourmark > 6 && hourmark < 20  ){
    
          if( min > 20 ){
            TheDate.setHours( TheDate.getHours() + 2 )
          }else{
            TheDate.setHours( TheDate.getHours() + 1 )
          }
    
          hourmark = TheDate.getHours()
    
          if( hourmark > 13 ){
            hourmark = hourmark - 12
            return(`${hourmark}pm  ${day}/${month + 1}/${year}`)
          }
    
          return(`${hourmark}am ${day}/${month + 1}/${year}`)
        }else{
    
          if( min > 20 ){
            TheDate.setHours( TheDate.getHours() + 2 )
          }else{
            TheDate.setHours( TheDate.getHours() + 1 )
          }
    
          if( hourmark > 20  ){
            TheDate.setDate( TheDate.getDate() + 1)
            day = TheDate.getDay()
            month = TheDate.getMonth()
            year = TheDate.getFullYear() 
            return(`${8}am ${day}/${month + 1}/${year}`)
          } 
    
          if( hourmark < 6 ){
            day = TheDate.getDay()
            month = TheDate.getMonth()
            year = TheDate.getFullYear() 
            return(`${8}am ${day}/${month + 1}/${year}`)
          }
          
        }
    
      }
    


    const ProceedToCheckout = () => {

        setCheckingout(true)

        if (
            Address.address == "" ||
            Address.city == "" ||
            Address.lga == "" ||
            Address.state == ""
        ) {
            
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'WARNING',
                textBody: "Please fill your Address",
              })

              setCheckingout(false)

        }else{

            const THeAddress = {
                address: Address.address,
                country: "Nigeria",
                state: Address.state,
                lga: Address.lga,
                city:Address.city,
             }
          
              Axios.post('/orders/create_order',THeAddress)
              .then((response)=>{
          
                UpdateUser_Cart(response.data.cart)
                navigation.navigate("My Orders")
                setUser_Notifications({
                    ...User_Notifications,
                    status:true
                })
                setCheckingout(false)

          
              })
              .catch((err) => {
          
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'WARNING',
                  textBody: err.response.data,
                })
                setCheckingout(false)
              })

        }
     
    }

    return (
    
        <Root>
            <ScrollView contentContainerStyle={{
            }} style={{
                flex:1,
                backgroundColor:"white",
            }}>
                

                { Cart ?
                
                    Cart.cart_products.length > 0 ?
                    
                        <>

                            <Paystack
                                paystackKey={PAYSTACK_PUBLIC_KEY}
                                paystackSecretKey={PAYSTACK_SECRET_KEY}
                                billingEmail={TheUser.email}
                                billingMobile={TheUser.phone_number}
                                billingName={TheUser.full_name}
                                amount={`${Cart.cart_total + 500}.00`}
                                currency="NGN"
                                // channels={JSON.stringify(["card"])}
                                onCancel={(e) => {
                                // handle response here
                                }}
                                onSuccess={(res) => {
                                    ProceedToCheckout()
                                }}
                                ref={paystackWebViewRef}
                            />
                        
                            { Cart.cart_products.map( (item,index) => {
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
                                        }} >{item.product.product_description}</Text>

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
                                            }} >₦{item.product.product_price}</Text>

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


                            { !loadingaddress ? 
                            
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
                                        {Address.address}
                                    </Text>

                                    <Text style={{
                                        fontFamily:colors.fontReg,
                                        fontSize:20,
                                        marginTop:5
                                    }} >
                                        {Address.state}, {Address.city}
                                    </Text>

                                    <TouchableOpacity onPress={ () => setModalVisible(true) } style={{
                                        marginTop:10,
                                        flexDirection:"row",
                                        alignItems:"center"
                                    }} >
                                        <AntDesign name="edit" size={20} color="orange" />
                                        <Text style={{
                                            fontFamily:colors.fontReg,
                                            marginLeft:10,
                                            color:"orange"
                                        }} > Edit Address </Text>
                                    </TouchableOpacity>

                                </View>

                            :<MainSpiner bgcolor={"orange"} /> }

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
                                    }} >Number of Items</Text>
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
                                    }} >Delivery Fee :</Text>
                                    <Text style={{
                                        fontFamily:colors.fontBold,
                                        fontSize:18
                                    }} >₦500.00</Text>
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
                                    }} >{GetDeliveryDate()}</Text>
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
                                    }} >₦{Cart.cart_total + 500 }</Text>
                                </View>

                                <CalltoactionButton loading={Checkingout} onPress={ 
                                    
                                    // () => ProceedToCheckout("Checkout Page") 
                                    ()=> paystackWebViewRef.current.startTransaction()
                                    
                                } text={`Pay ₦${Cart.cart_total + 500}`} />

                            </View>

                            <Modal
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

                                            <TouchableOpacity
                                                onPress={ () => setModalVisible(false)  }
                                                style={{
                                                    alignSelf:"flex-end",
                                                }} 
                                            >
                                                    <MaterialIcons name="cancel" size={24} color="black" />
                                            </TouchableOpacity> 

                                            <Text style={{
                                                fontFamily:colors.fontBold,
                                                fontSize:20
                                            }} > My Address </Text>


                                            <LoginDetailsComponents 
                                                    label={"Address"}
                                                    bgcolor={colors.specialGray}
                                                    placeholder="No 10 Olanrewaju Street Apata"
                                                    value={ Address.address }
                                                    onChange={ (e) => setAddress({
                                                        ...Address,
                                                        address:e
                                                    }) } 
                                            />

                                            <LoginDetailsComponents 
                                                    label={"State"}
                                                    bgcolor={colors.specialGray}
                                                    placeholder="Oyo"
                                                    value={ Address.state }
                                                    onChange={ (e) => setAddress({
                                                        ...Address,
                                                        state:e
                                                    }) } 
                                            />

                                                <LoginDetailsComponents 
                                                    label={"City"}
                                                    bgcolor={colors.specialGray}
                                                    placeholder="Ibadan"
                                                    value={ Address.city }
                                                    onChange={ (e) => setAddress({
                                                        ...Address,
                                                        city:e
                                                    }) } 
                                            />

                                                <LoginDetailsComponents 
                                                    label={"Local Government"}
                                                    bgcolor={colors.specialGray}
                                                    placeholder="Ido"
                                                    value={ Address.lga }
                                                    onChange={ (e) => setAddress({
                                                        ...Address,
                                                        lga:e
                                                    }) } 
                                            />

                                            <CalltoactionButton loading={ loadingaddress } onPress={ () => UpdateAddress() } text={"Update Address"} />

                                            </View>


                                        </View>

                            </Modal>
                        
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
                        }} >Your checkout is empty</Text>
    
                    </View>
                
                : <MainSpiner bgcolor={colors.primary} /> }

            </ScrollView>
        </Root>     
    
    );

}








const styles = StyleSheet.create({
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
        bottom:0,
        alignItems:"center",
        backgroundColor:"white",
        width:"100%",
        // height:"60%",
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });