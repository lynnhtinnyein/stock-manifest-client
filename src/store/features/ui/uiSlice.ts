import { createSlice } from "@reduxjs/toolkit";

interface UIState {
    isSettingMode: boolean;
}

const initialState: UIState = {
    isSettingMode: false
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setIsSettingMode(state, action: { payload: boolean }) {
            state.isSettingMode = action.payload;
        }
    }
});

export const { setIsSettingMode } = uiSlice.actions;
export default uiSlice.reducer;
