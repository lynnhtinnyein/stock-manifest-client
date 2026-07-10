import { createSlice } from "@reduxjs/toolkit";

interface UIState {
    showItemFormDrawer: boolean;
}

const initialState: UIState = {
    showItemFormDrawer: false
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setShowItemFormDrawer(state, action: { payload: boolean }) {
            state.showItemFormDrawer = action.payload;
        }
    }
});

export const { setShowItemFormDrawer } = uiSlice.actions;
export default uiSlice.reducer;
