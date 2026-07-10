import axios from "axios";
import Cipher from "../../utils/cipher";
import { store } from "@/store";
import { sessionExpired } from "@/store/features/auth/authSlice";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const httpClient = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
});

httpClient.interceptors.request.use(
    async (config) => {
        const storedToken = localStorage.getItem("stock-manifest-access-token");

        if (storedToken) {
            const cipher = new Cipher();
            const token = cipher.decrypt(storedToken);

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        config.headers["X-Timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;

        return config;
    },
    (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const signoutErrorStatuses = [
            401, // unauthenticated
            423 // locked
        ];

        const errorStatus = error?.response?.status;

        if (signoutErrorStatuses.includes(errorStatus)) {
            store.dispatch(sessionExpired());
            localStorage.removeItem("stock-manifest-access-token");
        }

        return Promise.reject(error);
    }
);

export default httpClient;
