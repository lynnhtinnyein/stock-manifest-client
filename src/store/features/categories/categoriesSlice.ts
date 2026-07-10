import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "./categoriesThunk";

const initialState: FlatState<Category> = {
    items: [],
    loading: false,
    error: null
};

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //fetch All
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch categories";
            });
    }
});

export default categoriesSlice.reducer;
