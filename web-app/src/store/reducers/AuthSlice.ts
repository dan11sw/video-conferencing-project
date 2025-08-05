import { createSlice } from "@reduxjs/toolkit";
import StoreConstants from "src/constants/store";
import AuthDataDto from "src/dtos/auth.data-dto";
import socket from "src/socket";

// Базовое состояние слайса
const initialState = {
    access_token: null as string | null,
    refresh_token: null as string | null,
    isAuthenticated: false,
    isLoading: false,
};

/**
 * Создание слайса для авторизации пользователя
 */
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loadingStart(state) {
            state.isLoading = true;
        },

        loadingEnd(state) {
            state.isLoading = false;
        },

        clear(state) {
            state.isLoading = false;
            state.access_token = null;
            state.refresh_token = null;
            state.isAuthenticated = false;
        },

        getAuthData(state) {
            const mainStore = localStorage.getItem(StoreConstants.mainStore);
    
            state.access_token = null;
            if (mainStore) {
                state.access_token = JSON.parse(mainStore)?.access_token ?? null
                state.refresh_token = JSON.parse(mainStore)?.refresh_token ?? null
            }

            state.isAuthenticated = !!state.access_token;
        },

        setAuthData(state, action) {
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
            state.isAuthenticated = !!state.access_token;

            localStorage.setItem(
                StoreConstants.mainStore,
                JSON.stringify({
                    ...(new AuthDataDto(state)),
                })
            );
        },

        /**
         * Функция авторизации пользователя
         * @param state 
         * @param action 
         */
        signInSuccess(state, action) {
            state.isLoading = false;
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
            state.isAuthenticated = !!state.access_token;

            localStorage.setItem(
                StoreConstants.mainStore,
                JSON.stringify({
                    ...(new AuthDataDto(state)),
                })
            );
        },

        /**
         * Функция регистрации нового пользователя
         * @param state Начальное состояние
         * @param action Новое состояние
         */
        signUpSuccess(state, action) {
            state.isLoading = false;
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
            state.isAuthenticated = !!state.access_token;

            localStorage.setItem(
                StoreConstants.mainStore,
                JSON.stringify({
                    ...(new AuthDataDto(state)),
                })
            );
        },

        /**
         * Функция разлогирования пользователя
         * @param state Начальное состояние
         */
        logout(state) {
            state.isLoading = false;
            state.access_token = null;
            state.refresh_token = null;
            state.isAuthenticated = false;

            localStorage.removeItem(StoreConstants.mainStore);
            socket.disconnect();
        },
    },
});

export default authSlice.reducer;