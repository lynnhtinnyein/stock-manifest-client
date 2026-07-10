type Route = {
    id: number;
    name: string;
    pathname: string;
    title: string;
    component: ComponentType;
    icon: ComponentType | null;
    requirePermission: PermissionValue | null;
    children?: Route[];
};

type SideDrawerRoute = {
    id: number;
    name: string;
    pathname: string;
    title: string;
    icon: ComponentType;
    requirePermission: PermissionValue | null;
};
