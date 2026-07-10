import { createAsyncThunk } from "@reduxjs/toolkit";
import { usersApi } from "./usersApi";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

export const fetchUsers = createAsyncThunk<
    PaginatedResponse<User>,
    PaginatedPayload<UserListFilters>,
    { rejectValue: string }
>("users/fetchAll", async (payload, { rejectWithValue }) => {
    try {
        return await usersApi.fetchAll(payload);
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const createUser = createAsyncThunk<User, CreateUserPayload, { rejectValue: string }>(
    "users/create",
    async (userData, { rejectWithValue }) => {
        try {
            return await usersApi.create(userData);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const updateUser = createAsyncThunk<
    User,
    { id: number; payload: UpdateUserPayload },
    { rejectValue: string }
>("users/update", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await usersApi.update(id, payload);
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const updateUserPassword = createAsyncThunk<
    number,
    { id: number; payload: UpdatePasswordPayload },
    { rejectValue: string }
>("users/updatePassword", async ({ id, payload }, { rejectWithValue }) => {
    try {
        await usersApi.updatePassword(id, payload);
        return id;
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const deleteUser = createAsyncThunk<number, number, { rejectValue: string }>(
    "users/delete",
    async (id, { rejectWithValue }) => {
        try {
            await usersApi.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const suspendUser = createAsyncThunk<User, number, { rejectValue: string }>(
    "users/suspend",
    async (id, { rejectWithValue }) => {
        try {
            return await usersApi.suspend(id);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const restoreUser = createAsyncThunk<User, number, { rejectValue: string }>(
    "users/restore",
    async (id, { rejectWithValue }) => {
        try {
            return await usersApi.restore(id);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);
