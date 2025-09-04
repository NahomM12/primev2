import { Navigate } from "react-router-dom";

export const PrivateRoutes = ({ children }) => {
   const getTokenFromLocalStorage = JSON.parse(localStorage.getItem('manager'))
   return getTokenFromLocalStorage?.token !== undefined ? children : (<Navigate to='/login' replace={true} />)
}