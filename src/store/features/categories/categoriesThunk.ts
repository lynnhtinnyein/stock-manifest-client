import { createAsyncThunk } from "@reduxjs/toolkit";
import { categoriesApi } from "./categoriesApi";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
    "categories/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await categoriesApi.fetchAll();
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const createCategory = createAsyncThunk<Category, { name: string; color: string }, { rejectValue: string }>(
    "categories/create",
    async ({ name, color }, { rejectWithValue }) => {
        try {
            return await categoriesApi.create(name, color);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const deleteCategory = createAsyncThunk<void, number, { rejectValue: string }>(
    "categories/delete",
    async (id, { rejectWithValue }) => {
        try {
            await categoriesApi.delete(id);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);
