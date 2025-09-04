import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlices";
import propertyReducer from "./property/propertySlice";
import transactionReducer from "./transaction/transactionSlice";
import userReducer from "./user/userSlice";
import saleReducer from "./sale/saleSlice";
import serviceReducer from "./schedulings/schedulingSlice";

export const store = configureStore({
  reducer: {
    property: propertyReducer,
    auth: authReducer,
    sale: saleReducer,
    user: userReducer,
    transaction: transactionReducer,
    service: serviceReducer,
  },
});
