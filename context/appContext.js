import React from 'react';


const AppContext = React.createContext({
    BaseUrl:null,
    User_details:null,
    LogOut: () => {},
    LogIn: () => {},
    UpdateUser_Cart: () => {},
    User_Cart:null,
    setUser_details:() => {},
    DisplayProducts:null,
    UpdateDisplayProducts: () => {},
    UserShop:null,
    setUserShop: () => {},
    GenRefresh:null,
    setGenRefresh: () => {},
    User_Notifications:null,
    setUser_Notifications:() => {},
})



export default AppContext;