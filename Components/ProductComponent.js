import { TouchableOpacity,Image,Text,View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import colors from "../config/colors";


const MainProduct = ({onPress,uri,product_name,product_description,product_price,edit}) => {

    return <TouchableOpacity 
                        
            onPress={onPress} 
            // onPress={() => console.log(User_Cart)} 
            
            style={{
                width:"45%",
                backgroundColor:"white",
                marginBottom:15,
                padding:20,
                borderRadius:10,
                justifyContent:"space-between"
            }} >

                <Image source={{uri:uri}} style={{
                    width:150,
                    height:100,
                    alignSelf:"center"
                }} />

                <Text numberOfLines={1} style={{
                    marginTop:10,
                    marginBottom:10,
                    fontFamily:colors.fontBold,
                    fontSize:20,
                    color:colors.gray
                }} >{product_name}</Text>

                <Text numberOfLines={3} style={{
                    color:"gray",
                    fontFamily:colors.fontReg,
                }} >
                    {product_description}
                </Text>

                <View style={{
                    marginTop:10,
                    flexDirection:"row",
                    justifyContent:"space-between",
                    alignItems:"center"
                }} >
                    <Text style={{
                        fontFamily:colors.fontBold,
                        fontSize:20,
                        color:colors.primary
                    }} >₦{product_price}</Text>

                    { !edit ?
                    
                    <AntDesign name="plus" size={24} style={{
                        backgroundColor:colors.orange,
                        padding:2,
                        borderRadius:5
                    }} color="white" />  

                    :

                    <AntDesign name="edit" size={19} style={{
                        backgroundColor:colors.orange,
                        padding:7,
                        borderRadius:5
                    }} color="white" />
                    
                    }                  

                </View>

            </TouchableOpacity>

}

export {MainProduct}