import { userProfileSlice } from "../../reducers/user/UserProfileSlice";
import messageQueueAction from "../MessageQueueAction";
import apiMainServer from "src/http/http";
import UserApi from "src/constants/user.api";
import { headers } from "src/config/headers";

/**
 * Отправка почтового сообщения
 * @param {*} data Данные для отправки формы
 * @returns
 */
export const profile = () => async (dispatch: any) => {
    try {
        // Изменение состояния loading слайса
        dispatch(userProfileSlice.actions.loadingStart());


        const response = await apiMainServer.get(
            UserApi.profile
        )

        // Обработка ошибок
        if ((response.status !== 200) && (response.status !== 201)) {
            dispatch(messageQueueAction.addMessage(response, "error"));
            return;
        }

        dispatch(userProfileSlice.actions.setProfile(response.data));
    } catch (e: any) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    } finally {
        dispatch(userProfileSlice.actions.loadingEnd());
    }
};

/**
 * Пополнение счёта
 * @param {*} data Данные для отправки формы
 * @returns
 */
export const accountRefill = (data: any, callback: () => void) => async (dispatch: any) => {
    try {
        // Изменение состояния loading слайса
        dispatch(userProfileSlice.actions.loadingStart());

        const response = await apiMainServer.post(
            UserApi.accountRefill,
            JSON.stringify({
                ...data
            }),
            headers
        )

        // Обработка ошибок
        if ((response.status !== 200) && (response.status !== 201)) {
            dispatch(messageQueueAction.addMessage(response, "error"));
            return;
        }

        dispatch(messageQueueAction.addMessage(null, "success", "Успешное пополнение счёта!"));
        callback();
    } catch (e: any) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    } finally {
        dispatch(userProfileSlice.actions.loadingEnd());
    }
};