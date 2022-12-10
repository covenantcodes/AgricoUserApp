import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";

const LoginDetailsComponents = ({label,placeholder,value,onChange,secure,bgcolor,lines}) => {

    return <View style={{
        width:"100%",
        marginTop:20
    }} > 

        <Text style={LoginDetails.label} >{label}</Text>

        <TextInput
            placeholder={placeholder}
            placeholderTextColor={LoginDetails.placeholder}
            style={[LoginDetails.text,{
                backgroundColor:bgcolor
            }]}
            value={value}
            numberOfLines={ lines ? lines : 1 }
            onChangeText={onChange}
            secureTextEntry={secure}
        />

    </View>

}


const CalltoactionButton = ({text,onPress,loading,styles}) => {

    return <TouchableOpacity disabled={ loading ? true : false } style={[calltoaction.button,styles]} onPress={onPress} >
        { loading ? <ActivityIndicator color={"white"} /> : <Text style={calltoaction.text} >{text}</Text> }
    </TouchableOpacity>

}

export {LoginDetailsComponents,CalltoactionButton};


const LoginDetails = StyleSheet.create({

    text:{
        // backgroundColor:"white",
        fontSize:18,
        width:"100%",
        padding:10,
        borderRadius:6
    },

    placeholder:{

    },

    label:{
        marginBottom:10,
        fontFamily:"TitilliumWeb-Bold",
        fontSize:18,
        color:"#333"
    }

})



const calltoaction = StyleSheet.create({
    button:{
        backgroundColor:colors.primary,
        width:"100%",
        padding:15,
        borderRadius:6,
        marginTop:40,
        justifyContent:"center",
        alignItems:"center"
    },
    text:{
        fontFamily:"TitilliumWeb-Bold",
        textAlign:"center",
        color:"white",
        fontSize:18,
    }
})