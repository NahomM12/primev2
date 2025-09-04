import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlices";
import userReducer from "./user/userSlice";
import propertyReducer from "./property/propertySlice";
import managerReducer from "./manager/managerSlice";
import  propertyTypeReducer from "./PropertyType/propertytypeSlice"
import regionReducer from "./address/region/regionSlice"
import subregionReducer from "./address/subRegion/subRegionSlice"
import locationReducer from "./address/location/locationSlice"
import transactionReducer from "./transaction/transactionSlice";  
import saleReducer from "./sale/saleSlice"
import darkModeReducer from "./darkMode/darkModeSlice"

export const store = configureStore({
  reducer: {
    regions:regionReducer,
    subregions:subregionReducer,
    locations:locationReducer,
    auth: authReducer,
    user: userReducer,
    transaction: transactionReducer,
    sale: saleReducer,
    property: propertyReducer,
    manager: managerReducer,
    propertyType: propertyTypeReducer,
    darkMode: darkModeReducer
  },
});
