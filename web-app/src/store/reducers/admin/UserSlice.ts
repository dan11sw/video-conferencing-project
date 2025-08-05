import { createSlice } from "@reduxjs/toolkit";
import { IUserModel } from "src/models/admin/IBloggerModel";


interface IUserReducer {
    users: IUserModel[];
    user: IUserModel | null;
    isLoading: boolean;
}

const initialState: IUserReducer = {
    users: [],
    user: null,
    isLoading: false,
};

export const adminUserSlice = createSlice({
    name: "admin_user_slice",
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

        setUser(state, action) {
            state.isLoading = false;
            state.user = null;
            
            if (action.payload) {
                state.user = action.payload;
            }
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

export default adminUserSlice.reducer;