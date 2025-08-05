import { FC, memo, useState, useEffect } from "react";
import styles from "./BloggerServiceItem.module.scss";
import { IServiceModel } from "src/models/blogger/IServiceModel";
import { Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddService from "../AddService";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import {
  addService,
  getAccessServices,
  getCurrentServices,
} from "src/store/actions/blogger/BloggerAction";

export interface IBloggerServiceItemProps {
  data: IServiceModel;
  blogger_id: number;
}

const BloggerServiceItem: FC<IBloggerServiceItemProps> = ({ data, blogger_id }) => {
  const dispatch = useAppDispatch();
  const [addOpen, setAddOpen] = useState(false);

  const handleAdd = () => {
    setAddOpen(true);
  };

  const actionAdd = (
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
      addService(
        {
          blogger_id: blogger_id,
          services_id: data.id,
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
              `Услуга \"${data.title}\" добавлена!`
            )
          );
          setAddOpen(false);
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
          {data.title}
        </span>
        <span>
          <b>Описание услуги:</b>
          <br />
          {data.description}
        </span>
        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={handleAdd}
        >
          Добавить услугу
        </Button>
      </div>
      <AddService
        open={addOpen}
        setOpen={setAddOpen}
        service={data}
        action={actionAdd}
      />
    </>
  );
};

export default memo(BloggerServiceItem);
