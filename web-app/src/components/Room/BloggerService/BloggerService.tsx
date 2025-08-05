import { FC, memo, useEffect } from "react";
import styles from "./BloggerService.module.scss";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { getAccessServices, getCurrentServices } from "src/store/actions/blogger/BloggerAction";
import BloggerServiceItem from "../BloggerServiceItem";
import { ICurrentServiceModel } from "src/models/blogger/IServiceModel";

export interface IBloggerServiceProps {
  services: ICurrentServiceModel[];
  rooms_uuid: string;
}

const BloggerService: FC<IBloggerServiceProps> = ({ services, rooms_uuid }) => {
  return (
    <>
      <div className={styles.container}>
        <div>
          <h5>Список предоставляемых услуг: </h5>
          <div className={styles.listAccessServices}>
            {services.map((item) => (
              <BloggerServiceItem data={item} rooms_uuid={rooms_uuid}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(BloggerService);
