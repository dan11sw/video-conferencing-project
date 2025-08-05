import { createSlice } from "@reduxjs/toolkit";
import { IUserInfoModel } from "src/models/IUserInfoModel";


interface IAdminReducer {
    users: IUserInfoModel[]
    isLoading: boolean;
}

// Базовое состояние слайса
const initialState: IAdminReducer = {
    users: [],
    isLoading: false,
};

/* Создание слайса для API формы обращений */
export const adminSlice = createSlice({
    name: "admin",
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

        setUsers(state, action) {
            state.isLoading = false;
            state.users = [];
            
            if (action.payload) {
                state.users = state.users.concat(action.payload);
            }
        }
    },
});

export default adminSlice.reducer;