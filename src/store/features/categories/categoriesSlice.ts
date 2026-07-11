import { createSlice } from "@reduxjs/toolkit";
import { createCategory, deleteCategory, fetchCategories } from "./categoriesThunk";

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
            })

            .addCase(createCategory.fulfilled, (state, action) => {
                state.items.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.items = state.items.filter((category) => category.id !== action.meta.arg);
                state.loading = false;
                state.error = null;
            });
    }
});

export default categoriesSlice.reducer;
