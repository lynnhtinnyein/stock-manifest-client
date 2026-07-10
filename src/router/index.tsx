import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { privateRoutes, publicRoutes } from "./routes";
import Middleware from "./Middlewares";
import NotFound from "@/pages/NotFound";

const RouterOutlet = () => {
    return (
        <Routes>
            <Route element={<Middleware.CheckAuth />}>
                <Route element={<Middleware.NoAuthOnly />}>
                    {publicRoutes.map((route) => {
                        const Component = route.component;
                        return (
                            <Route key={route.id} path={route.pathname} element={<Component />} />
                        );
                    })}
                </Route>
                <Route element={<Middleware.AuthGuard />}>
                    {privateRoutes.map((route) => {
                        const Component = route.component;
                        return (
                            <Route
                                key={route.id}
                                element={
                                    <Middleware.AuthorizationGuard
                                        requirePermission={route.requirePermission}
                                    />
                                }
                            >
                                <Route
                                    path={route.pathname}
                                    element={
                                        //TODO: Add a fallback component for Suspense
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <Component />
                                        </Suspense>
                                    }
                                />
                            </Route>
                        );
                    })}
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export { RouterOutlet };
