import { createSlice } from "@reduxjs/toolkit";
import { ITransferTokenModel } from "src/models/admin/ITransferTokenModel";


interface ITransferTokenReducer {
    transfers: ITransferTokenModel[];
    isLoading: boolean;
}

const initialState: ITransferTokenReducer = {
    transfers: [],
    isLoading: false,
};

/* Создание слайса для API формы обращений */
export const adminTransferTokenSlice = createSlice({
    name: "admin_transfer_token",
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

        setTransferToken(state, action) {
            state.isLoading = false;
            state.transfers = [];
            
            if (action.payload) {
                state.transfers = state.transfers.concat(action.payload);
            }
        }
    },
});

export default adminTransferTokenSlice.reducer;