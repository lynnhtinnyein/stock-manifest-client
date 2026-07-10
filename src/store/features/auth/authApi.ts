import httpClient from "@/lib/api-clients/httpClient";

export const authApi = {
    check: async () => {
        const res = await httpClient.get("auth/check");
        return res.data;
    },

    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const res = await httpClient.post("auth/login", credentials);
        return res.data;
    },

    logout: async () => {
        const res = await httpClient.post("auth/logout");
        return res.data;
    },

    me: async () => {
        const res = await httpClient.get("auth/me");
        return res.data;
    },

    changePassword: async (payload: ChangePasswordPayload) => {
        const res = await httpClient.patch("auth/change-password", payload);
        return res.data;
    }
};
