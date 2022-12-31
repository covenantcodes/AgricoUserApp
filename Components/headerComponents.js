import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, TextInput, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import colors from '../config/colors';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../context/appContext';
import UserImage from '../assets/images/man.png';
import Axios from 'axios'; 
 

 
 function ProfileHeader ({navigation,title}){


    return (

            <View style={styles.header}>
                <StatusBar backgroundColor={colors.primary} />
                
                <TouchableOpacity style={styles.header_left} onPress={() => navigation.goBack()} >
                    <AntDesign  name="arrowleft" style={styles.header_left_ic} size={18} /> 
                </TouchableOpacity>

                <View style={styles.header_right} >

                    <Text style={styles.header_right_top} >{title}</Text>

                </View>

                <TouchableOpacity style={styles.header_left}>
                    <AntDesign  name="arrowleft" style={styles.header_left_ic2} size={18} /> 
                </TouchableOpacity>

            </View>

    );

}
 
function SpecialHeader ({navigation,title,bgcolor}){


    return (

            <View style={[styles.header,{
                backgroundColor: bgcolor ? bgcolor : colors.primary
            }]}>
                <StatusBar backgroundColor={ bgcolor ? bgcolor : colors.primary } />
                
                <TouchableOpacity style={styles.header_left} onPress={() => navigation.goBack()} >
                    <AntDesign  name="arrowleft" style={styles.header_left_ic} size={18} /> 
                </TouchableOpacity>

                <View style={styles.header_right} >

                    <Text style={styles.header_right_top} >{title}</Text>

                </View>

                <TouchableOpacity style={styles.header_left}>
                    <AntDesign  name="edit" style={[styles.header_left_ic2,{
                        color:bgcolor ? bgcolor : colors.primary
                    }]} size={18} /> 
                </TouchableOpacity>

            </View>

    );

}


function HomeHeader ({navigation,title}){

    const {User_details,GenRefresh,UpdateDisplayProducts} = useContext(AppContext)
    const [ user, setuser ] = useState()
    const [ SeachQuery, setSeachQuery ] = useState() 
    const [ currentCategories, setcurrentCategories ] = useState()
    const [ Categories, setCategories ] = useState()

    useEffect( () => {
        setuser(User_details)
    }, [User_details] )

    useEffect( () => {

        Axios.get('/categories/').then(
            response => {
                setCategories(response.data)
            }
        ).catch(
            err => {
            }
        )

    }, [] )



    useEffect( () => {

        UpdateDisplayProducts({
            error:false,
            loading:true,
            products:false
        })

        Axios.get("/").then(

            response => {
                UpdateDisplayProducts({
                    error:false,
                    loading:false,
                    products:[...response.data]
                })
            }
    
        ).catch(
            err => {
                UpdateDisplayProducts({
                    error:"Something went wrong",
                    loading:false,
                    products:false
                })
            }
        )

    }, [GenRefresh] )



    const HandleCategorySearch = (category_id,category_name) => {

        if (!category_id) {
            return
        }

        setcurrentCategories(category_name)

        UpdateDisplayProducts({
            error:false,
            loading:true,
            products:false
        })


        Axios.get(
            `/products/?category=${category_id}`
        ).then( (response) => {

            UpdateDisplayProducts({
                error:false,
                loading:false,
                products:[...response.data]
            })

        } ).catch( (e) => {
            UpdateDisplayProducts({
                error:"Something went wrong",
                loading:false,
                products:false
            })
        } )

    }

    const HandleQuerySearch = () => {

        UpdateDisplayProducts({
            error:false,
            loading:true,
            products:false
        })

        if ( SeachQuery === '' ) {
            Axios.get(
                `/products/`
            ).then( (response) => {
    
                UpdateDisplayProducts({
                    error:false,
                    loading:false,
                    products:[...response.data]
                })
    
            } ).catch( (e) => {
                UpdateDisplayProducts({
                    error:"Something went wrong",
                    loading:false,
                    products:false
                })
            } )
        }

        else{
            Axios.get(
                `/products/?search=${SeachQuery}`
            ).then( (response) => {
    
                UpdateDisplayProducts({
                    error:false,
                    loading:false,
                    products:[...response.data]
                })
    
            } ).catch( (e) => {
                UpdateDisplayProducts({
                    error:"Something went wrong",
                    loading:false,
                    products:false
                })
            } )
        }

    }




    return (

            <View style={{
                backgroundColor:"white",
                marginTop:30,
                padding:20,
                paddingBottom:10
            }}>
                <StatusBar backgroundColor={colors.white} />

                <View style={{
                    flexDirection:"row",
                }} >

                    <TouchableOpacity onPress={ () => navigation.navigate("Profile_Navigation") } >
                        <Image 
                            source={ user && user.profile_image.url ? 
                                {uri:user.profile_image.url}
                                : UserImage }
                            style={{
                                width:40,
                                height:40,
                                borderRadius:200,
                                marginRight:10
                            }} />
                    </TouchableOpacity>

                      <View>
                        <Text style={{
                            fontFamily:"TitilliumWeb-Regular"
                        }} > Hi </Text>  
                        <Text style={{
                            fontFamily:"TitilliumWeb-Bold"
                        }} > {user?user.full_name:''} </Text>  
                      </View>  

                </View>

                <TextInput 
                    placeholder="What are you looking for?"
                    value={SeachQuery}
                    onChange={ e => setSeachQuery(e.nativeEvent.text) }
                    onSubmitEditing={ () => HandleQuerySearch() }
                    // onSubmitEditing={ () => navigation.navigate("Product Details") }
                    style={{
                        backgroundColor:colors.specialGray,
                        padding:10,
                        borderRadius:8,
                        marginTop:20,
                        fontFamily:"TitilliumWeb-Regular"
                    }} />

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{
                        alignItems:"center"
                    }} style={{
                        marginTop:10,
                }} >

                    { Categories ? Categories.map( (link) => {

                        if(link.category_name === currentCategories ) {
                            return <TouchableOpacity onPress={ () => HandleCategorySearch(link._id,link.category_name) } key={link._id} style={{
                                        alignItems:"center",
                                        marginLeft:15
                                    }} >
                                        <Text style={{
                                            fontFamily:colors.fontBold,
                                            // borderBottomColor:,
                                            fontSize:20
                                        }} > {link.category_name} </Text>
                                        <View style={{
                                            width:"50%",
                                            backgroundColor:"tomato",
                                            height:4,
                                            borderRadius:200,
                                            marginTop:7
                                        }} ></View>
                                    </TouchableOpacity>

                        }else{
                            return <TouchableOpacity onPress={ () => HandleCategorySearch(link._id,link.category_name) } style={{
                                        alignItems:"center",
                                        marginLeft:15
                                    }} key={link._id} >
                                        <Text style={{
                                            fontFamily:colors.fontReg,
                                            color:"gray",
                                            fontSize:16
                                        }} > {link.category_name} </Text>
                                    </TouchableOpacity>
                        }

                    } ) : null }

                    <View style={{width:20}} ></View>

                </ScrollView>

            </View>

    );

}




const styles = StyleSheet.create({

    header:{
        backgroundColor:colors.primary,
        // width:"",
        // flex:1,
        marginTop:30,
        // marginRight:,
        padding:14,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },

    header_left:{
        // marginRight:"10%"
    },

    header_left_ic:{
        color:"white",
        padding:10,
    },

    header_right_top:{
        color:"white",
        fontSize:22,
        fontFamily:'TitilliumWeb-Bold',
    },

    header_left_ic2:{
        color:colors.primary,
        padding:10,
    },


})

export {ProfileHeader,HomeHeader,SpecialHeader}