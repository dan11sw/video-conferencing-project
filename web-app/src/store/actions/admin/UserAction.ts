import { adminUserSlice } from "src/store/reducers/admin/UserSlice";
import messageQueueAction from "../MessageQueueAction";
import apiMainServer from "src/http/http";
import AdminApi from "src/constants/admin.api";

/**
 * Получение списка блоггеров
 * @returns 
 */
export const getUsers = () => async (dispatch: any) => {
    try {
        dispatch(adminUserSlice.actions.loadingStart());
        const response = await apiMainServer.get(
            AdminApi.getAllUser
        );

        // Обработка ошибок
        if ((response.status !== 200) && (response.status !== 201)) {
            dispatch(messageQueueAction.addMessage(response, "error"));
            return;
        }

        dispatch(adminUserSlice.actions.setUsers(response.data));
    } catch (e: any) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    } finally {
        dispatch(adminUserSlice.actions.loadingEnd());
    }
};

/**
 * Получение информации о блогере
 * @returns 
 */
export const getUser = (data: any) => async (dispatch: any) => {
    try {
        dispatch(adminUserSlice.actions.loadingStart());
        const response = await apiMainServer.post(
            AdminApi.getUser,
            JSON.stringify({
                ...data
            }),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        // Обработка ошибок
        if ((response.status !== 200) && (response.status !== 201)) {
            dispatch(messageQueueAction.addMessage(response, "error"));
            return;
        }

        dispatch(adminUserSlice.actions.setUser(response.data));
    } catch (e: any) {
        const errors = e.response.data.errors;
        if ((errors) && (errors.length > 0)) {
            dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
        } else {
            dispatch(messageQueueAction.errorMessage(e));
        }
    } finally {
        dispatch(adminUserSlice.actions.loadingEnd());
    }
};

const AdminUserAction = {
    getUsers,
    getUser
};

export default AdminUserAction;