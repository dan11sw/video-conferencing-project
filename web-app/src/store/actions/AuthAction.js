/* Libraries */
import axios from "axios";

/* Context */
import { authSlice } from "../reducers/AuthSlice";
import { messageQueueSlice } from "../reducers/MessageQueueSlice";
import messageQueueAction from "./MessageQueueAction";

/* Constants */
import Api from "src/constants/api";
import AuthApi from "src/constants/auth.api";
import apiMainServer from "src/http/http";

/**
 * Авторизация пользователя
 * @param {*} data Авторизационные данные пользователя
 * @returns
 */
export const authSignIn = (data) => async (dispatch) => {
    try {
        // Изменение состояния loading слайса
        dispatch(authSlice.actions.loadingStart());

        const response = await axios.post(
            (Api.mainServer + AuthApi.signIn),
            JSON.stringify({
                ...data
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );

        // Обработка ошибок
        if ((response.status !== 200) && (response.status !== 201)) {
            dispatch(messageQueueAction.addMessage(response, "error"));
            return;
        }

        dispatch(messageQueueAction.addMessage(response, "success", "Успешная авторизация!"));

        // Вызов операции для авторизации пользователя в рамках системы управления состоянием
        dispatch(authSlice.actions.signInSuccess(response.data));
    } catch (e) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    } finally {
        dispatch(authSlice.actions.loadingEnd());
    }
};

/**
 * Регистрация нового пользователя
 * @param {*} data Регистрационные данные пользователя
 * @param {*} profileImage Изображение пользователя (фото профиля)
 * @returns
 */
export const authSignUp = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.loadingStart());

        const response = await axios.post(
            (Api.mainServer + AuthApi.signUp),
            JSON.stringify({
                ...data
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );

        if ((response.status !== 200) && (response.status !== 201)) {
            dispatch(messageQueueAction.addMessage(response, "error"));
            return;
        }

        dispatch(messageQueueAction.addMessage(response, "success", "Успешная регистрация нового пользователя!"));
        dispatch(authSlice.actions.signUpSuccess(response.data));
    } catch (e) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    }

    dispatch(authSlice.actions.loadingEnd());
};

/**
 * Обновление токена доступа
 * @param {*} data Данные для обновления токена
 * @returns
 */
export const refreshAccessToken = (data) => async (dispatch) => {
    dispatch(authSlice.actions.loadingStart());

    try {
        dispatch(authSlice.actions.signInSuccess(data));
    } catch (e) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    }

    dispatch(authSlice.actions.loadingEnd());
}

export const authUpdate = () => async (dispatch) => {
    try {
        dispatch(authSlice.actions.loadingStart());
        dispatch(authSlice.actions.getAuthData());
    } catch (e) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    }

    dispatch(authSlice.actions.loadingEnd());
};

/**
 * Выход пользователя из системы
 * @returns
 */
export const authLogout = (refresh_token) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.loadingStart());

        const response = await apiMainServer.post(AuthApi.logout, {
            refresh_token: refresh_token
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
    } catch (e) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    }

    dispatch(authSlice.actions.logout());
    dispatch(messageQueueAction.addMessage(null, "dark", "Выход из аккаунта"));
}

/**
 * Установка данных состояния
 * @param {*} accessToken Токен доступа
 * @returns
 */
export const setAuthData = (accessToken) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.loadingStart());
        dispatch(authSlice.actions.setAuthData(accessToken));
    } catch (e) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    }

    dispatch(authSlice.actions.loadingEnd());
};