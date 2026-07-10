import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";

export const publicRoutes: Route[] = [
    {
        id: 1,
        name: "login",
        pathname: "/",
        title: "Login",
        component: LoginPage,
        icon: null,
        requirePermission: null
    }
];

export const privateRoutes: Route[] = [
    {
        id: 1,
        name: "home",
        pathname: "/home",
        title: "Home",
        component: HomePage,
        icon: null,
        requirePermission: null
    }
];

export const sideDrawerRoutes: SideDrawerRoute[] = privateRoutes.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ component, children, ...rest }) => rest
);
