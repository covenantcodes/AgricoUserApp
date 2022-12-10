import { useContext, useEffect, useState,useCallback } from "react";
import { RefreshControl,FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../../config/colors";
import AppContext from "../../context/appContext";
import { MainProduct } from "../../Components/ProductComponent";
import { ReconnectComponent } from "../../Components/ReconnectComponent";
import { MainSpiner } from "../../Components/spinnerComponents";
import Axios from "axios";

export const HomeIndex = ({navigation}) => {

    const { BaseUrl, DisplayProducts, UpdateDisplayProducts, GenRefresh, setGenRefresh, setUser_Notifications } = useContext(AppContext)

    const [ Products, setProducts ] = useState()
    const [ refreshing, setRefreshing ] = useState(false)

    useEffect( () => {

        setProducts(DisplayProducts)

    }, [DisplayProducts] )

    useEffect( () => {



    }, [GenRefresh] )



    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setGenRefresh()
        setRefreshing(false)
      }, []);


    if ( Products ) {
        return (
        <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
            alignItems:"center"
        }} style={{
            flex:1,
            paddingTop:5,
            backgroundColor:colors.specialGray,
        }} >
    
    
    
            <View style={{
                marginTop:10,
                width:"100%",
                padding:10,
                marginBottom:60,
                paddingTop:40,
                flexDirection:"row",
                flexWrap:"wrap",
                justifyContent:"space-evenly"
            }} >
    
                { Products.products && !Products.loading && !Products.error ?
                
                    Products.products.length > 0 ? 
                    
                        Products.products.map( (product) => {
                            return <MainProduct
                                        onPress={() => navigation.navigate("Product Details",product)}
                                        key={product._id}
                                        uri={product.product_images[0].url}
                                        product_name={product.product_name}
                                        product_description={product.product_description}
                                        product_price={product.product_price}
                                    />
                        } )
    
                    : <Text> No Products Available </Text>
                
                : Products.loading && !Products.products && !Products.error ? 
                
                    <MainSpiner bgcolor={colors.primary} />
                
                : <ReconnectComponent retryFunction={ () => setGenRefresh() } /> }
    
            </View>
    
        </ScrollView>
        )
    }

}