/* Библиотеки */
import { Routes, Route, Navigate } from "react-router-dom";
import { useCallback } from "react";
import IRouteModel from "src/models/IRouteModel";
import baseRouteConfig from "./configs/base.route.config";
import authRouteConfig from "./configs/auth.route.config";
import funcRouteConfig from "./configs/func.route.config";
import adminRouteConfig from "./configs/admin.route.config";
import WithToastify from "src/hoc-helpers/WithToastify/WithToastify";
import store from "src/store/store";

/**
 * Хук для получения всех маршрутов
 * @param isAuthenticated Флаг авторизации пользователя
 * @returns {JSX.Element} Функциональный компонент по URL
 */
const useRoutes = () => {
    const isAuthenticated = (store.getState().authReducer.access_token) ? true : false;

    const createRoutes = useCallback((routes: IRouteModel[]) => {
        return (
            routes && routes.map((value) => (<Route key={value.path} path={value.path} element={<value.element />}/>) )
        )
    }, []);

    return (
        <Routes>
            { isAuthenticated && createRoutes(baseRouteConfig) }

            { isAuthenticated && createRoutes(funcRouteConfig) }
            
            { createRoutes(authRouteConfig) }

            { createRoutes(adminRouteConfig) }

            <Route path='*' element={<Navigate to={"/auth/sign-in"} />} />
        </Routes>
    );
};

export default WithToastify(useRoutes);