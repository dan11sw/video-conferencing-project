import { adminTransferTokenSlice } from "src/store/reducers/admin/TransferTokenSlice";
import messageQueueAction from "../MessageQueueAction";
import apiMainServer from "src/http/http";
import AdminApi from "src/constants/admin.api";
import { IChangeRoleModel } from "src/models/admin/IChangeRoleModel";
import { ISignUpModel } from "src/models/IAuthModel";

/**
 * Отправка почтового сообщения
 * @param {*} data Данные для отправки формы
 * @returns
 */
export const getTransferToken = () => async (dispatch: any) => {
    try {
        dispatch(adminTransferTokenSlice.actions.loadingStart());
        const response = await apiMainServer.get(
            AdminApi.getTransferToken
        );

        // Обработка ошибок
        if ((response.status !== 200) && (response.status !== 201)) {
            dispatch(messageQueueAction.addMessage(response, "error"));
            return;
        }

        dispatch(adminTransferTokenSlice.actions.setTransferToken(response.data));
    } catch (e: any) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    } finally {
        dispatch(adminTransferTokenSlice.actions.loadingEnd());
    }
};

const AdminTransferTokenAction = {
    getTransferToken
};

export default AdminTransferTokenAction;