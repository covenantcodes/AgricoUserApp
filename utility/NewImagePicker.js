import * as ImagePicker from 'expo-image-picker';


const checkForCameraRollPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert("Please grant camera roll permissions inside your system's settings");
    } else {
        // console.log('Media Permissions are granted')
        return true
    }
    
}


export {checkForCameraRollPermission}