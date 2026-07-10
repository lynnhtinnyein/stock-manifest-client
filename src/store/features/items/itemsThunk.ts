import { createAsyncThunk } from "@reduxjs/toolkit";
import { itemsApi } from "./itemsApi";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

export const fetchItems = createAsyncThunk<
    PaginatedResponse<Item>,
    PaginatedPayload<ItemFilters>,
    { rejectValue: string }
>("items/fetchAll", async (payload, { rejectWithValue, signal }) => {
    try {
        return await itemsApi.fetchAll(payload, signal);
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const createItem = createAsyncThunk<Item, CreateItemPayload, { rejectValue: string }>(
    "items/create",
    async (payload, { rejectWithValue }) => {
        try {
            return await itemsApi.create(payload);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);
