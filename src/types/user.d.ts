type UserStatus = "ACTIVE" | "SUSPENDED";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

type MiniUser = {
    id: number;
    name: string;
    nickname: string;
};

type UserFormData = {
    name: string;
    nickname: string;
    password: string;
    confirmPassword: string;
    role: "" | UserRole;
};

type User = {
    id: number;
    name: string;
    nickname: string;
    permissions: Permission[];
    role: UserRole;
    isSuspended: boolean;

    suspendedAt: string | null;
    suspendedBy: User | null;

    restoredAt: string | null;
    restoredBy: User | null;

    createdAt: string;
    createdBy: User | null;

    updatedAt: string;
};

type UserListFilters = {
    search?: string;
    status?: "ALL" | UserStatus;
    role?: "ALL" | UserRole;
};

interface CreateUserPayload {
    name: string;
    nickname: string;
    username: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    permissionIds: number[];
}

interface UpdateUserPayload {
    name?: string;
    nickname?: string;
    username?: string;
    role?: UserRole;
    permissionIds?: number[];
}

interface UpdatePasswordPayload {
    password: string;
    confirmPassword: string;
}
