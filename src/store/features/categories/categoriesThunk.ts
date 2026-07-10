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
