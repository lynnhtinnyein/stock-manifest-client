import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

export const login = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            return await authApi.login(payload);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const checkAuth = createAsyncThunk<User, void, { rejectValue: string }>(
    "auth/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            return await authApi.me();
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout();
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);
