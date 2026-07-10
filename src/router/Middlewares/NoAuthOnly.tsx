import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

//only allow when user is not logged in state
const NoAuthOnly = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    return isAuthenticated ? <Navigate to="/home" /> : <Outlet />;
};

export default NoAuthOnly;
