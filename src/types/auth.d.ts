type LoginCredentials = {
    username: string;
    password: string;
    remember?: boolean;
};

type LoginFormData = {
    username: string;
    password: string;
    remember: boolean;
}

type LoginResponse = {
    user: User;
    accessToken: string;
}

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
};

//update password is different from change password
//update password used by admin to change other user's password
//change password used by user to change their own password
interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}