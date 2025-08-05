import { createSlice } from "@reduxjs/toolkit";
import StoreConstants from "src/constants/store";
import AuthDataDto from "src/dtos/auth.data-dto";
import { IGetContentModel } from "src/models/IContentModel";

export interface IUserContentReducer {
    content: IGetContentModel[];
    isLoading: boolean;
}

// Базовое состояние слайса
const initialState: IUserContentReducer = {
    content: [],
    isLoading: false,
};

/**
 * Создание слайса для авторизации пользователя
 */
export const userContentSlice = createSlice({
    name: "user_content",
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

        setContent(state, action) {
            state.isLoading = false;
            state.content = [];
            
            if (action.payload) {
                state.content = state.content.concat(action.payload);
            }
        }
    },
});

export default userContentSlice.reducer;