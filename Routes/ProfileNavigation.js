import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileHomeScreen from '../Screens/profileScreen';
import { ProfileHeader } from '../Components/headerComponents';
import EditProfileScreen from '../Screens/editprofileScreen';


export default function ProfileNavigation(){

        
    const ProfileStackScreen = createNativeStackNavigator();

      return (
        <ProfileStackScreen.Navigator initialRouteName='Profile' screenOptions={{
          header: ({navigation,route}) => <ProfileHeader title={route.name} navigation={navigation} />,
          headerBackVisible:false
        }} >
            <ProfileStackScreen.Screen name='Profile' component={ProfileHomeScreen} />
            <ProfileStackScreen.Screen name='Edit Profile' component={EditProfileScreen} />
        </ProfileStackScreen.Navigator>
      );

}