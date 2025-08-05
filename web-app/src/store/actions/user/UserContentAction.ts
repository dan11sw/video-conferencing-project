import messageQueueAction from "../MessageQueueAction";
import apiMainServer from "src/http/http";
import BloggerApi from "src/constants/blogger.api";
import { ICreateContentModel } from "src/models/IContentModel";
import { userContentSlice } from "src/store/reducers/user/UserContentSlice";
import { authSlice } from "src/store/reducers/AuthSlice";
import Api from "src/constants/api";
import store from "src/constants/store";
import axios from "axios";
import { headers } from "src/config/headers";
import UserApi from "src/constants/user.api";

/**
 * Получение контента блогера
 * @returns
 */
export const getContent = () => async (dispatch: any) => {
  dispatch(userContentSlice.actions.loadingStart());
  try {
    const response = await apiMainServer.get(UserApi.getContent, headers);

    if (response.status !== 200 && response.status !== 201) {
      dispatch(messageQueueAction.addMessage(response, "error"));
      return;
    }

    dispatch(userContentSlice.actions.setContent(response.data));
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
    dispatch(userContentSlice.actions.loadingEnd());
  }
};

/**
 * Покупка контента
 * @param {*} data Данные для отправки формы
 * @returns
 */
export const buyContent = (data: any, callback: () => void) => async (dispatch: any) => {
  try {
      // Изменение состояния loading слайса
      dispatch(userContentSlice.actions.loadingStart());

      const response = await apiMainServer.post(
          UserApi.buyContent,
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

      dispatch(getContent());
      dispatch(messageQueueAction.addMessage(null, "success", "Контент приобретён!"));
      callback();
  } catch (e: any) {
      const errors = e.response.data.errors;
      if ((errors) && (errors.length > 0)) {
          dispatch(messageQueueAction.addMessage(null, "error", errors[errors.length - 1].msg));
      } else {
          dispatch(messageQueueAction.errorMessage(e));
      }
  } finally {
      dispatch(userContentSlice.actions.loadingEnd());
  }
};