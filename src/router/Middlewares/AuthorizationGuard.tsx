import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import NotFound from "@/pages/NotFound";

interface Props {
    requirePermission: PermissionValue | null;
}

//to check user's required permission
const AuthorizationGuard = ({ requirePermission }: Props) => {
    const { user } = useAppSelector((state) => state.auth);
    const permissionValues = user?.permissions.map((p) => p.value) || [];
    if (!requirePermission) return <Outlet />;
    return permissionValues.includes(requirePermission) ? <Outlet /> : <NotFound />;
};

export default AuthorizationGuard;
