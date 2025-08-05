import { createSlice } from "@reduxjs/toolkit";

interface IUserProfileReducer {
    id: number;
    nickname: string;
    email: string;
    tokens: number;
    isLoading: boolean;
}

// Базовое состояние слайса
const initialState: IUserProfileReducer = {
    id: -1,
    nickname: '',
    email: '',
    tokens: 0,
    isLoading: false,
};

/* Создание слайса для API формы обращений */
export const userProfileSlice = createSlice({
    name: "user_profile",
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

        setProfile(state, action) {
            state.id = action.payload.id;
            state.nickname = action.payload.nickname;
            state.email = action.payload.email;
            state.tokens = action.payload.tokens;
        }
    },
});

export default userProfileSlice.reducer;