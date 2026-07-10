import { createAsyncThunk } from "@reduxjs/toolkit";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { settingsApi } from "./settingsApi";

export const fetchSettings = createAsyncThunk<Setting[], void, { rejectValue: string }>(
    "settings/fetch",
    async (_, { rejectWithValue }) => {
        try {
            return await settingsApi.fetch();
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const updateSettings = createAsyncThunk<
    Setting[],
    UpdateSettingsPayload,
    { rejectValue: string }
>("settings/update", async (payload, { rejectWithValue }) => {
    try {
        return await settingsApi.updateSettings(payload);
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error));
    }
});
