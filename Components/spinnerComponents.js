import { ActivityIndicator, View } from "react-native"
import colors from "../config/colors";

const MainSpiner = ({bgcolor}) => {

    return <View style={{
        flex: 1,
        justifyContent:"center",
    }} >

            <ActivityIndicator size={"large"} color={bgcolor ? bgcolor : colors.primary}  />

    </View>

}


export {MainSpiner};