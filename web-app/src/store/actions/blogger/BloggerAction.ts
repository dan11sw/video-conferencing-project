import messageQueueAction from "../MessageQueueAction";
import apiMainServer from "src/http/http";
import BloggerApi from "src/constants/blogger.api";
import {
  ICreateContentModel,
  IUpdateContentModel,
} from "src/models/IContentModel";
import { bloggerSlice } from "src/store/reducers/blogger/BloggerSlice";
import { authSlice } from "src/store/reducers/AuthSlice";
import Api from "src/constants/api";
import store from "src/constants/store";
import axios from "axios";
import { headers } from "src/config/headers";

/**
 * Создание нового контента
 * @param {*} data Данные для создания контента
 * @returns
 */
export const createContent =
  (
    data: ICreateContentModel,
    file: File,
    files: File[],
    callback: () => void
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(bloggerSlice.actions.loadingStart());

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("logo", file, file.name);

      for (let i = 0; i < files.length; i++) {
        formData.append("objects", files[i], files[i].name);
      }

      const response = await apiMainServer.post(
        BloggerApi.createContent,
        formData
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      dispatch(
        messageQueueAction.addMessage(
          null,
          "success",
          "Контент успешно добавлен!"
        )
      );

      dispatch(getContent());
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
      dispatch(bloggerSlice.actions.loadingEnd());
    }
  };

/**
 * Создание нового контента
 * @param {*} data Данные для создания контента
 * @returns
 */
export const updateContent =
  (data: IUpdateContentModel, file: File | null, callback: () => void) =>
  async (dispatch: any) => {
    try {
      dispatch(bloggerSlice.actions.loadingStart());

      const formData = new FormData();
      formData.append(
        "content_sales_id",
        data.content_sales_id as unknown as string
      );
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);

      if (file) {
        formData.append("logo", file, file.name);
      }

      const response = await apiMainServer.post(
        BloggerApi.updateContent,
        formData
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      dispatch(
        messageQueueAction.addMessage(
          null,
          "success",
          "Контент успешно обновлён!"
        )
      );

      dispatch(getContent());
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
      dispatch(bloggerSlice.actions.loadingEnd());
    }
  };

/**
 * Получение контента блогера
 * @returns
 */
export const getContent = () => async (dispatch: any) => {
  dispatch(bloggerSlice.actions.loadingStart());
  try {
    const response = await apiMainServer.get(BloggerApi.getContent, headers);

    if (response.status !== 200 && response.status !== 201) {
      dispatch(messageQueueAction.addMessage(response, "error"));
      return;
    }

    dispatch(bloggerSlice.actions.setContent(response.data));
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
    dispatch(bloggerSlice.actions.loadingEnd());
  }
};

/**
 * Удаление контента
 * @returns
 */
export const deleteContent =
  (data: any, callback: () => void) => async (dispatch: any) => {
    dispatch(bloggerSlice.actions.loadingStart());
    try {
      const response = await apiMainServer.post(
        BloggerApi.deleteContent,
        JSON.stringify({
          ...data,
        }),
        headers
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      callback();
      dispatch(
        messageQueueAction.addMessage(null, "dark", "Контент был удалён")
      );
      dispatch(getContent());
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
      dispatch(bloggerSlice.actions.loadingEnd());
    }
  };

/**
 * Получение списка доступных услуг
 * @returns Список доступных услуг
 */
export const getAccessServices =
  (blogger_id: number) => async (dispatch: any) => {
    dispatch(bloggerSlice.actions.loadingStart());
    try {
      const response = await apiMainServer.post(
        BloggerApi.getAllServices,
        {
          blogger_id: blogger_id,
        },
        headers
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      dispatch(bloggerSlice.actions.setAccessServices(response.data));
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
      dispatch(bloggerSlice.actions.loadingEnd());
    }
  };

/**
 * Получение списка услуг, которые предоставляет текущий менеджер
 * @returns Список доступных услуг
 */
export const getCurrentServices =
  (blogger_id: number) => async (dispatch: any) => {
    dispatch(bloggerSlice.actions.loadingStart());
    try {
      const response = await apiMainServer.post(
        BloggerApi.getCurrentServices,
        {
          blogger_id: blogger_id,
        },
        headers
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      dispatch(bloggerSlice.actions.setCurrentServices(response.data));
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
      dispatch(bloggerSlice.actions.loadingEnd());
    }
  };

/**
 * Удаление услуги
 * @param blogger_id Идентификатор блогера
 * @param services_id Идентификатор услуги
 * @param cb Функция обратного вызова
 * @returns
 */
export const deleteService =
  (blogger_id: number, services_id: number, cb: () => void) =>
  async (dispatch: any) => {
    dispatch(bloggerSlice.actions.loadingStart());
    try {
      const response = await apiMainServer.post(
        BloggerApi.deleteServices,
        {
          blogger_id: blogger_id,
          services_id: services_id,
        },
        headers
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      cb();
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
      dispatch(bloggerSlice.actions.loadingEnd());
    }
  };

/**
 * Добавление услуги
 * @param blogger_id Идентификатор блогера
 * @param services_id Идентификатор услуги
 * @param cb Функция обратного вызова
 * @returns
 */
export const addService =
  (data: any, cb: () => void) => async (dispatch: any) => {
    dispatch(bloggerSlice.actions.loadingStart());
    try {
      const response = await apiMainServer.post(
        BloggerApi.addServices,
        data,
        headers
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      cb();
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
      dispatch(bloggerSlice.actions.loadingEnd());
    }
  };

/**
 * Изменение услуги
 * @param blogger_id Идентификатор блогера
 * @param services_id Идентификатор услуги
 * @param cb Функция обратного вызова
 * @returns
 */
export const editService =
  (data: any, cb: () => void) => async (dispatch: any) => {
    dispatch(bloggerSlice.actions.loadingStart());
    try {
      const response = await apiMainServer.post(
        BloggerApi.editServices,
        data,
        headers
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      cb();
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
      dispatch(bloggerSlice.actions.loadingEnd());
    }
  };
