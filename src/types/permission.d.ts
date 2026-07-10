type PermissionValue =
    // items
    | "items.view_stocks"
    | "items.view_solds"
    | "items.view_addeds"
    | "items.sell"
    | "items.create"
    | "items.manage"

    // debts
    | "debts.view"
    | "debts.accept"
    | "debts.manage"

    // collaterals
    | "collaterals.view"
    | "collaterals.accept_interest"
    | "collaterals.create"
    | "collaterals.manage"

    // trader_weights
    | "trader_weights.view"
    | "trader_weights.create"

    // settings
    | "settings.manage"

    // reports
    | "reports.view_sales"
    | "reports.view_networth"

    // finance
    | "finance.resolve_cash_settlements"

    // users
    | "users.view"
    | "users.manage"
    | "users.manage_roles";

type Permission = {
    id: number;
    name: string;
    description: string;
    isAdminDefault: boolean;
    accessibleRoles: UserRole[];
    value: PermissionValue;
    dependencyIds: number[];
    isHidden: boolean;
    riskLevel: number;
};

type PermissionGroup = {
    id: number;
    title: string;
    permissions: Permission[];
};
