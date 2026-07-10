import CheckAuth from "./CheckAuth";
import AuthorizationGuard from "./AuthorizationGuard";
import NoAuthOnly from "./NoAuthOnly";
import AuthGuard from "./AuthGuard";

const Middleware = {
    CheckAuth: () => <CheckAuth />,
    AuthGuard: () => <AuthGuard />,
    NoAuthOnly: () => <NoAuthOnly />,
    AuthorizationGuard: ({ requirePermission }: { requirePermission: PermissionValue | null }) => (
        <AuthorizationGuard requirePermission={requirePermission} />
    )
};

export default Middleware;
