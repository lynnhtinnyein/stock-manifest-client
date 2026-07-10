import { useLayoutEffect } from "react";
import { RouterOutlet } from "./router";
import { checkAuth } from "./store/features/auth/authThunk";
import { useAppDispatch } from "./store/hooks";

const App = () => {
    const dispatch = useAppDispatch();

    useLayoutEffect(() => {
        const storedToken = localStorage.getItem("stock-manifest-access-token");
        if (!storedToken) {
            return;
        }
        //rest handle by httpClient and redux slice
        dispatch(checkAuth());
    }, [dispatch]);

    return <RouterOutlet />;
};

export default App;
