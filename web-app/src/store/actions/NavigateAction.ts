import Address from "src/constants/address";
import { navigateSlice } from "../reducers/NavigateReducer";


export const setToForm = (data: { toForm: boolean }) => async (dispatch: any) => {
    dispatch(navigateSlice.actions.setToForm(data.toForm));
};

export const setToMain = (data: { toMain: boolean }) => async (dispatch: any) => {
    dispatch(navigateSlice.actions.setToMain(data.toMain));
};

export const setToTeacher = (data: { toTeacher: boolean }) => async (dispatch: any) => {
    dispatch(navigateSlice.actions.setToTeacher(data.toTeacher));
};

export const setToCourse = (data: { toCourse: boolean }) => async (dispatch: any) => {
    dispatch(navigateSlice.actions.setToCourse(data.toCourse));
};