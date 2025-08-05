import { FC, memo } from "react";
import styles from "./RequestService.module.scss";
import { ICurrentServiceModel } from "src/models/blogger/IServiceModel";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Button } from "@mui/material";

export interface IRequestServiceProps {
  services: ICurrentServiceModel[];
  nickname: string;
  users_id: number;
  services_id: number;
}

const RequestService: FC<IRequestServiceProps> = ({
  services,
  services_id,
  nickname,
  users_id,
}) => {
  return (
    <>
      <div className={styles.container}>
        <span>
          {`Пользователь под ником ${nickname} хочет получить услугу
            \"${
              services.filter((item) => item.services_id !== services_id)[0]
                .service.title
            }\"`}
        </span>
        <Button variant="contained" endIcon={<ThumbUpIcon />}>
          Принять запрос
        </Button>
      </div>
    </>
  );
};

export default memo(RequestService);
