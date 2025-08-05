import { FC, memo, useEffect, useState } from "react";
import styles from "./BloggerServiceItem.module.css";
import { ICurrentServiceModel } from "src/models/blogger/IServiceModel";
import { declOfNum } from "src/utils/value";
import { Button } from "@mui/material";
import RequestPageIcon from '@mui/icons-material/RequestPage';
import QuestionDialog from "src/components/QuestionDialog";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import {
  deleteService,
  editService,
  getAccessServices,
  getCurrentServices,
} from "src/store/actions/blogger/BloggerAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import socket from "src/socket";

export interface IBloggerServiceItemProps {
  data: ICurrentServiceModel;
  rooms_uuid: string;
}

const BloggerServiceItem: FC<IBloggerServiceItemProps> = ({
  data,
  rooms_uuid,
}) => {
  const dispatch = useAppDispatch();

  const handleRequest = () => {
    socket.emit("request_service", {
      rooms_uuid: rooms_uuid,
      services_id: data.services_id,
    });
    dispatch(
      messageQueueAction.addMessage(
        null,
        "success",
        "Запрос отправлен блогеру, ожидайте его решения"
      )
    );
  };

  return (
    <>
      <div className={styles.container}>
        <span>
          <b>Название услуги:</b>
          <br />
          {data.service.title}
        </span>
        <span>
          <b>Описание услуги:</b>
          <br />
          {data.service.description}
        </span>
        <span>
          <b>Ограничение на время:</b>
          <br />
          {data.time_limit ? (
            <span>
              {data.time_limit}{" "}
              {declOfNum(data.time_limit, ["секунда", "секунд", "секунд"])}
            </span>
          ) : (
            "нет"
          )}
        </span>
        <span>
          <b>Ограничение на число повторений:</b>
          <br />
          {data.count_limit ? (
            <span>
              {data.count_limit}{" "}
              {declOfNum(data.count_limit, ["раз", "раза", "раза"])}
            </span>
          ) : (
            "нет"
          )}
        </span>
        <span>
          <b>Цена:</b>
          <br />
          {data.price ? (
            <span>
              {data.price}{" "}
              {declOfNum(data.price, ["токен", "токена", "токенов"])}
            </span>
          ) : (
            "нет"
          )}
        </span>
        <Button
          variant="contained"
          endIcon={<RequestPageIcon />}
          onClick={handleRequest}
        >
          Запросить услугу
        </Button>
      </div>
    </>
  );
};

export default memo(BloggerServiceItem);
