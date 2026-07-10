import { createSlice } from "@reduxjs/toolkit";
import { checkAuth, login } from "./authThunk";
import Cipher from "@/utils/cipher";

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        sessionExpired: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = "Session expired!";
            localStorage.removeItem("stock-manifest-access-token");
        }
    },
    extraReducers: (builder) => {
        builder
            //login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                const { user, accessToken } = action.payload;
                state.loading = false;
                state.isAuthenticated = true;
                state.user = user;

                const cipher = new Cipher();
                const encryptedToken = cipher.encrypt(accessToken);

                localStorage.setItem("stock-manifest-access-token", encryptedToken);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to login";
            })

            //check auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.error = "Session expired!";
                state.isAuthenticated = false;
                state.user = null;

                localStorage.removeItem("stock-manifest-access-token");
            })

            //log out
            .addCase("auth/logout", (state) => {
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem("stock-manifest-access-token");
            });
    }
});

export const { sessionExpired } = authSlice.actions;
export default authSlice.reducer;
