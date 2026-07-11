import { createAsyncThunk } from "@reduxjs/toolkit";
import { itemsApi } from "./itemsApi";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { invalidateImageUrl } from "@/utils/protectedImageCache";
import type { RootState } from "@/store";

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
    { rejectValue: string; state: RootState }
>("items/update", async ({ id, payload }, { getState, rejectWithValue }) => {
    try {
        const previousImageUrl = getState().items.items.find((item) => item.id === id)?.image?.url;
        const updatedItem = await itemsApi.update(id, payload);
        if (previousImageUrl && previousImageUrl !== updatedItem.image?.url) {
            invalidateImageUrl(previousImageUrl);
        }
        return updatedItem;
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
    { rejectValue: string; state: RootState }
>("items/syncImage", async ({ id, payload }, { getState, rejectWithValue }) => {
    try {
        const previousImageUrl = getState().items.items.find((item) => item.id === id)?.image?.url;
        const updatedItem = await itemsApi.syncImage(id, payload);
        if (previousImageUrl && previousImageUrl !== updatedItem.image?.url) {
            invalidateImageUrl(previousImageUrl);
        }
        return updatedItem;
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
    }
});
