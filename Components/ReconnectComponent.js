import { View,Image,Text,TouchableOpacity } from 'react-native';
import Errormessage from '../assets/images/internet_connection.png';
import colors from '../config/colors';


export const ReconnectComponent = ({retryFunction}) => {

    return <View style={{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
      }} >
    
          <Image source={Errormessage} style={{
            width:200,
            height:200
          }}  />
  
          <Text style={{
            marginTop:10,
            fontSize:26,
            fontFamily:colors.fontBold
          }} > Oops!!! </Text>
          <Text style={{
            marginTop:10,
            fontSize:20,
            textAlign:"center",
            width:"80%",
            alignSelf:"center", 
            fontFamily:colors.fontReg
          }}> Please check your internet connection and try again </Text>
  
          <TouchableOpacity onPress={ retryFunction } style={{
            backgroundColor:colors.primary,
            padding:10,
            marginTop:20,
            borderRadius:44
          }} >
            <Text style={{
              color:"white",
              fontFamily:colors.fontBold,
              fontSize:20,
            }} > Reconnect </Text>
          </TouchableOpacity>
    
      </View>

}