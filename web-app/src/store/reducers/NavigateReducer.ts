import { createSlice } from "@reduxjs/toolkit";

interface NavigateReducerAction {
    toMain: boolean;
    toForm: boolean;
    toTeacher: boolean;
    toCourse: boolean;
    isLoading: boolean;
}

// Базовое состояние слайса
const initialState: NavigateReducerAction = {
    toMain: false,
    toTeacher: false,
    toCourse: false,
    toForm: false,
    isLoading: false,
};

/* Создание слайса для API формы обращений */
export const navigateSlice = createSlice({
    name: "navigate",
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
        },

        setToForm(state, action) {
            state.toForm = action.payload;
        },

        setToMain(state, action) {
            state.toMain = action.payload;
        },

        setToTeacher(state, action) {
            state.toTeacher = action.payload;
        },

        setToCourse(state, action) {
            state.toCourse = action.payload;
        },
    },
});

export default navigateSlice.reducer;