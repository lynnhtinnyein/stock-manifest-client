import { configureStore } from "@reduxjs/toolkit";
import { authListener } from "./features/auth/authListener";
import uiReducer from "./features/ui/uiSlice";
import authReducer from "./features/auth/authSlice";
import settingsReducer from "./features/settings/settingsSlice";
import itemsReducer from "./features/items/itemsSlice";
import categoriesReducer from "./features/categories/categoriesSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        auth: authReducer,
        settings: settingsReducer,
        categories: categoriesReducer,
        items: itemsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(authListener.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
