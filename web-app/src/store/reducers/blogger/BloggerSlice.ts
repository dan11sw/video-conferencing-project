import { createSlice } from "@reduxjs/toolkit";
import StoreConstants from "src/constants/store";
import AuthDataDto from "src/dtos/auth.data-dto";
import { IGetContentModel } from "src/models/IContentModel";
import { ICurrentServiceModel, IServiceModel } from "src/models/blogger/IServiceModel";


export interface IBloggerReducer {
    content: IGetContentModel[];
    access_services: IServiceModel[];
    current_services: ICurrentServiceModel[];
    isLoading: boolean;
}

// Базовое состояние слайса
const initialState: IBloggerReducer = {
    content: [],
    access_services: [],
    current_services: [],
    isLoading: false,
};

/**
 * Создание слайса для авторизации пользователя
 */
export const bloggerSlice = createSlice({
    name: "blogger",
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
            state.content = [];
            state.access_services = [];
            state.current_services = [];
        },

        setCurrentServices(state, action) {
            state.isLoading = false;
            if(action.payload){
                state.current_services = action.payload;
            }
        },

        setAccessServices(state, action) {
            state.isLoading = false;
            if(action.payload){
                state.access_services = action.payload;
            }
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

export default bloggerSlice.reducer;