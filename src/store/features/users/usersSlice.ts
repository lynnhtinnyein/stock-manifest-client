import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    restoreUser
} from "./usersThunk";

const initialState: PaginatedReduxState<User> = {
    items: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    totalElements: 0,
    hasMore: false
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        hydrate: (state, action: PayloadAction<PaginatedResponse<User>>) => {
            const { content, page, totalPages, totalElements, hasMore } = action.payload;
            state.items = content;
            state.page = page;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.hasMore = hasMore;
            state.loading = false;
            state.error = null;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //fetch All
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                const { content, page, totalPages, totalElements, hasMore } = action.payload;
                state.items = content;
                state.page = page;
                state.totalPages = totalPages;
                state.totalElements = totalElements;
                state.hasMore = hasMore;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch users";
            })

            //create
            .addCase(createUser.pending, (state) => {
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.items = [action.payload, ...state.items];
                state.totalElements += 1;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.error = action.payload || "Failed to create user";
            })

            //update
            .addCase(updateUser.pending, (state) => {
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.items.findIndex((user) => user.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload || "Failed to update user";
            })

            //delete
            .addCase(deleteUser.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.items = state.items.filter((user) => user.id !== action.payload);
                state.totalElements -= 1;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload || "Failed to delete user";
            })

            //suspend
            .addCase(suspendUser.pending, (state) => {
                state.error = null;
            })
            .addCase(suspendUser.fulfilled, (state, action) => {
                const user = action.payload;
                state.items = state.items.map((prev) => (prev.id === user.id ? user : prev));
            })
            .addCase(suspendUser.rejected, (state, action) => {
                state.error = action.error.message || "Failed to suspend user";
            })

            //restore
            .addCase(restoreUser.pending, (state) => {
                state.error = null;
            })
            .addCase(restoreUser.fulfilled, (state, action) => {
                const user = action.payload;
                state.items = state.items.map((prev) => (prev.id === user.id ? user : prev));
            })
            .addCase(restoreUser.rejected, (state, action) => {
                state.error = action.error.message || "Failed to enable user";
            });
    }
});

export const { hydrate, setPage } = usersSlice.actions;
export default usersSlice.reducer;
