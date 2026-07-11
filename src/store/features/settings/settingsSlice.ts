import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchSettings, updateSettings } from "./settingsThunk";

type State = {
    exchangeRate: string;
};

const initialState: State = {
    exchangeRate: ""
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch settings
            .addCase(fetchSettings.pending, (state) => {
                state.exchangeRate = "";
            })
            .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<Settings>) => {
                state.exchangeRate = action.payload.exchangeRate || "";
            })
            .addCase(fetchSettings.rejected, (state) => {
                state.exchangeRate = "";
            })

            // update settings
            .addCase(updateSettings.pending, (state) => {
                state.exchangeRate = "";
            })
            .addCase(updateSettings.fulfilled, (state, action: PayloadAction<Settings>) => {
                state.exchangeRate = action.payload.exchangeRate || "";
            })
            .addCase(updateSettings.rejected, (state) => {
                state.exchangeRate = "";
            });
    }
});

export default settingsSlice.reducer;
