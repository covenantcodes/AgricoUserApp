import { Ionicons, FontAwesome5,FontAwesome  } from '@expo/vector-icons'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Text, View} from 'react-native';
import colors from '../config/colors';
import LoginScreen from '../Screens/loginScreen';
import { OtpScreen } from '../Screens/OtpScreen';
import RegisterScreen from '../Screens/registerScreen';
import {SpecialHeader} from '../Components/headerComponents';
import OnBoardScreen from '../Screens/OnborardingScreen';

export default function AuthNavigation(){
    
    
      const AuthNavigator = createNativeStackNavigator();


      return    <AuthNavigator.Navigator>
                    <AuthNavigator.Screen name='OnBorardingScreen' component={OnBoardScreen} options={{
                        headerShown:false
                    }} />
                    <AuthNavigator.Screen name='LoginPage' component={LoginScreen} options={{
                        headerShown:false
                    }} />
                    <AuthNavigator.Screen name='RegisterPage' component={RegisterScreen} options={{
                        headerShown:false
                    }} />
                    <AuthNavigator.Screen name='Otp_Page' component={OtpScreen} options={{
                        header: ({navigation,route}) => <SpecialHeader bgcolor={colors.primary} title="Verify your account" navigation={navigation} />
                    }} />
                </AuthNavigator.Navigator>
}