import { createListenerMiddleware } from "@reduxjs/toolkit";
import { checkAuth, login } from "./authThunk";
import { fetchSettings } from "../settings/settingsThunk";
import { fetchCategories } from "../categories/categoriesThunk";

export const authListener = createListenerMiddleware();

authListener.startListening({
    actionCreator: login.fulfilled,
    effect: async (_, listenerApi) => {
        listenerApi.dispatch(fetchSettings());
        listenerApi.dispatch(fetchCategories());
    }
});

authListener.startListening({
    actionCreator: checkAuth.fulfilled,
    effect: async (_, listenerApi) => {
        listenerApi.dispatch(fetchSettings());
        listenerApi.dispatch(fetchCategories());
    }
});
