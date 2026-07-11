import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createItem, deleteItem, fetchItems, updateItem } from "./itemsThunk";

const initialState: PaginatedState<Item> = {
    items: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalElements: 0,
    hasMore: false
};

const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //fetch All
            .addCase(fetchItems.pending, (state, action) => {
                const upcomingPage = action.meta.arg.pagination?.page || 1;
                state.loading = true;
                state.error = null;

                //clear all previous items if the first page
                if (upcomingPage === 1) {
                    state.items = [];
                }
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                const { content, page, totalPages, totalElements, hasMore } = action.payload;
                state.items = page === 1 ? content : [...state.items, ...content];
                state.page = page;
                state.totalPages = totalPages;
                state.totalElements = totalElements;
                state.hasMore = hasMore;
                state.loading = false;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                const isCancelled = action.error.name === "AbortError";
                if (isCancelled) {
                    return;
                }
                state.loading = false;
                state.error = action.payload || "Failed to fetch stockItems";
            })

            .addCase(createItem.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                state.totalElements += 1;
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                const updatedItem = action.payload;
                const index = state.items.findIndex((item) => item.id === updatedItem.id);
                if (index !== -1) {
                    state.items[index] = updatedItem;
                }
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                const deletedItemId = action.meta.arg;
                state.items = state.items.filter((item) => item.id !== deletedItemId);
                state.totalElements -= 1;
            });
    }
});

export const { setPage } = itemsSlice.actions;
export default itemsSlice.reducer;
