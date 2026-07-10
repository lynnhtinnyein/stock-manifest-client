import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";

//to check user is logged in or not
const AuthGuard = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default AuthGuard;
