import { adminSlice } from "src/store/reducers/admin/AdminSlice";
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
export const getUsers = () => async (dispatch: any) => {
  try {
    // Изменение состояния loading слайса
    dispatch(adminSlice.actions.loadingStart());

    const response = await apiMainServer.get(AdminApi.getUsers);

    // Обработка ошибок
    if (response.status !== 200 && response.status !== 201) {
      dispatch(messageQueueAction.addMessage(response, "error"));
      return;
    }

    dispatch(adminSlice.actions.setUsers(response.data));
  } catch (e: any) {
    const errors = e.response.data.errors;
    if (errors && errors.length > 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          errors[errors.length - 1].msg
        )
      );
    } else {
      dispatch(messageQueueAction.errorMessage(e));
    }
  } finally {
    dispatch(adminSlice.actions.loadingEnd());
  }
};

/**
 * Изменение роли пользователя
 * @param {*} data Данные для отправки формы
 * @returns
 */
export const changeRole = (data: IChangeRoleModel) => async (dispatch: any) => {
  try {
    // Изменение состояния loading слайса
    dispatch(adminSlice.actions.loadingStart());

    const response = await apiMainServer.post(
      AdminApi.changeRole,
      JSON.stringify({
        ...data,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      dispatch(messageQueueAction.addMessage(response, "error"));
      return;
    }

    dispatch(getUsers());
    dispatch(
      messageQueueAction.addMessage(null, "success", "Роль успешно изменена!")
    );
  } catch (e: any) {
    const errors = e.response.data.errors;
    if (errors && errors.length > 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          errors[errors.length - 1].msg
        )
      );
    } else {
      dispatch(messageQueueAction.errorMessage(e));
    }
  } finally {
    dispatch(adminSlice.actions.loadingEnd());
  }
};

/**
 * Создание блогера
 * @param {*} data Данные для отправки формы
 * @returns
 */
export const createBlogger = (data: ISignUpModel) => async (dispatch: any) => {
  try {
    // Изменение состояния loading слайса
    dispatch(adminSlice.actions.loadingStart());

    const response = await apiMainServer.post(
      AdminApi.createBlogger,
      JSON.stringify({
        ...data,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      dispatch(messageQueueAction.addMessage(response, "error"));
      return;
    }

    dispatch(getUsers());
    dispatch(
      messageQueueAction.addMessage(null, "success", "Блогер успешно создан!")
    );
  } catch (e: any) {
    const errors = e.response.data.errors;
    if (errors && errors.length > 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          errors[errors.length - 1].msg
        )
      );
    } else {
      dispatch(messageQueueAction.errorMessage(e));
    }
  } finally {
    dispatch(adminSlice.actions.loadingEnd());
  }
};

/**
 * Добавление токенов
 * @param data Данные для добавления токенов
 * @param callback Функция обратного вызова
 * @returns
 */
export const addToken =
  (data: any, callback: () => void) => async (dispatch: any) => {
    try {
      // Изменение состояния loading слайса
      dispatch(adminSlice.actions.loadingStart());

      const response = await apiMainServer.post(
        AdminApi.addToken,
        JSON.stringify({
          ...data,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Обработка ошибок
      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      dispatch(
        messageQueueAction.addMessage(
          null,
          "success",
          "Успешное пополнение счёта!"
        )
      );
      callback();
    } catch (e: any) {
      const errors = e.response.data.errors;
      if (errors && errors.length > 0) {
        dispatch(
          messageQueueAction.addMessage(
            null,
            "error",
            errors[errors.length - 1].msg
          )
        );
      } else {
        dispatch(messageQueueAction.errorMessage(e));
      }
    } finally {
      dispatch(adminSlice.actions.loadingEnd());
    }
  };

/**
 * Удаление токенов
 * @param data Данные для удаления токенов
 * @param callback Функция обратного вызова
 * @returns
 */
export const deleteToken =
  (data: any, callback: () => void) => async (dispatch: any) => {
    try {
      // Изменение состояния loading слайса
      dispatch(adminSlice.actions.loadingStart());

      const response = await apiMainServer.post(
        AdminApi.deleteToken,
        JSON.stringify({
          ...data,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Обработка ошибок
      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      dispatch(
        messageQueueAction.addMessage(
          null,
          "success",
          "Успешное удаление токенов!"
        )
      );
      callback();
    } catch (e: any) {
      const errors = e.response.data.errors;
      if (errors && errors.length > 0) {
        dispatch(
          messageQueueAction.addMessage(
            null,
            "error",
            errors[errors.length - 1].msg
          )
        );
      } else {
        dispatch(messageQueueAction.errorMessage(e));
      }
    } finally {
      dispatch(adminSlice.actions.loadingEnd());
    }
  };

/**
 * Перенос токенов с одного аккаунта на другой
 * @param data Данные для переноса токенов
 * @param callback Функция обратного вызова
 * @returns
 */
export const transferToken =
  (data: any, callback: () => void) => async (dispatch: any) => {
    try {
      // Изменение состояния loading слайса
      dispatch(adminSlice.actions.loadingStart());

      const response = await apiMainServer.post(
        AdminApi.transferToken,
        JSON.stringify({
          ...data,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Обработка ошибок
      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      dispatch(
        messageQueueAction.addMessage(
          null,
          "success",
          "Успешный перенос токенов с одного аккаунта на другой!"
        )
      );
      callback();
    } catch (e: any) {
      const errors = e.response.data.errors;
      if (errors && errors.length > 0) {
        dispatch(
          messageQueueAction.addMessage(
            null,
            "error",
            errors[errors.length - 1].msg
          )
        );
      } else {
        dispatch(messageQueueAction.errorMessage(e));
      }
    } finally {
      dispatch(adminSlice.actions.loadingEnd());
    }
  };
