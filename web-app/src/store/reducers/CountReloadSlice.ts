import { createSlice } from "@reduxjs/toolkit";

// Базовое состояние слайса
const initialState = {
    count_reload: 0
};

/**
 * Создание слайса для авторизации пользователя
 */
export const countReloadSlice = createSlice({
    name: "count_reload",
    initialState,
    reducers: {
        clear(state) {
            state.count_reload = 0;
        },

        setCount(state, action) {
            state.count_reload = action.payload.count_reload;
        },

        increment(state) {
            state.count_reload = state.count_reload + 1;
        }
    },
});

export default countReloadSlice.reducer;