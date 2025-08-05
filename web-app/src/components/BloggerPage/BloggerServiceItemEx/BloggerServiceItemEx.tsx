import { FC, memo, useEffect, useState } from "react";
import styles from "./BloggerServiceItemEx.module.css";
import { ICurrentServiceModel } from "src/models/blogger/IServiceModel";
import { declOfNum } from "src/utils/value";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionDialog from "src/components/QuestionDialog";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import {
  deleteService,
  editService,
  getAccessServices,
  getCurrentServices,
} from "src/store/actions/blogger/BloggerAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import EditService from "../EditService";

export interface IBloggerServiceItemExProps {
  data: ICurrentServiceModel;
  blogger_id: number;
}

const BloggerServiceItemEx: FC<IBloggerServiceItemExProps> = ({ data, blogger_id }) => {
  const dispatch = useAppDispatch();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const actionDelete = () => {
    dispatch(
      deleteService(blogger_id, data.services_id, () => {
        dispatch(getAccessServices(blogger_id));
        dispatch(getCurrentServices(blogger_id));
        dispatch(
          messageQueueAction.addMessage(
            null,
            "dark",
            `Услуга \"${data.service.title}\" удалена`
          )
        );
        setDeleteOpen(false);
      })
    );
  };

  const handleDelete = () => {
    setDeleteOpen(true);
  };

  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = () => {
    setEditOpen(true);
  };

  const actionEdit = (
    time_limit: number | null,
    count_limit: number | null,
    price: number
  ) => {
    if (!time_limit && !count_limit) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Необходимо указать либо временное, либо количественное ограничение (можно оба сразу)"
        )
      );
      return;
    }

    if (price <= 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Цена за оказание услуги должна быть больше либо равна 1-ому токену"
        )
      );
      return;
    }

    dispatch(
      editService(
        {
          blogger_id: blogger_id,
          services_id: data.service.id,
          price: price,
          time_limit: time_limit,
          count_limit: count_limit,
        },
        () => {
          dispatch(getAccessServices(blogger_id));
          dispatch(getCurrentServices(blogger_id));
          dispatch(
            messageQueueAction.addMessage(
              null,
              "success",
              `Услуга \"${data.service.title}\" изменена!`
            )
          );
          setEditOpen(false);
        }
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
        <Button variant="contained" endIcon={<EditIcon />} onClick={handleEdit}>
          Изменить услугу
        </Button>
        <Button
          variant="contained"
          endIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Удалить услугу
        </Button>
      </div>
      <QuestionDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        text={`Вы действительно хотите удалить услугу \"${data.service.title}\" ?`}
        subText={
          "В случае удаления данная услуга не будет предоставляться пользователям"
        }
        action={actionDelete}
      />
      <EditService
        open={editOpen}
        setOpen={setEditOpen}
        service={data}
        action={actionEdit}
      />
    </>
  );
};

export default memo(BloggerServiceItemEx);
