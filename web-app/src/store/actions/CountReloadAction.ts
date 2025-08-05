
import { countReloadSlice } from "../reducers/CountReloadSlice";


export const increment = () => async (dispatch: any) => {
    dispatch(countReloadSlice.actions.increment());
};

export const clear = () => async (dispatch: any) => {
    dispatch(countReloadSlice.actions.clear());
};