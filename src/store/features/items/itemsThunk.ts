import { createAsyncThunk } from "@reduxjs/toolkit";
import { itemsApi } from "./itemsApi";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

export const fetchItems = createAsyncThunk<
    PaginatedResponse<Item>,
    PaginatedPayload<ItemListFilters>,
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

export const updateItem = createAsyncThunk<
    Item,
    { id: number; payload: UpdateItemPayload },
    { rejectValue: string }
>("items/update", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await itemsApi.update(id, payload);
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const deleteItem = createAsyncThunk<void, number, { rejectValue: string }>(
    "items/delete",
    async (id, { rejectWithValue }) => {
        try {
            await itemsApi.delete(id);
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const syncImage = createAsyncThunk<
    Item,
    { id: number; payload: FormData },
    { rejectValue: string }
>("items/syncImage", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await itemsApi.syncImage(id, payload);
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
    }
});
