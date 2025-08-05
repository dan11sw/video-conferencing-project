import { FC, memo, useEffect } from "react";
import styles from "./BloggerService.module.scss";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { getAccessServices, getCurrentServices } from "src/store/actions/blogger/BloggerAction";
import BloggerServiceItem from "../BloggerServiceItem";
import BloggerServiceItemEx from "../BloggerServiceItemEx";

export interface IBloggerServiceProps {
  blogger_id: number;
}

const BloggerService: FC<IBloggerServiceProps> = ({ blogger_id }) => {
  const bloggerSelector = useAppSelector((s) => s.bloggerReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAccessServices(blogger_id));
    dispatch(getCurrentServices(blogger_id));
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div>
          <h5>Список возможных услуг: </h5>
          <div className={styles.listAccessServices}>
            {bloggerSelector.access_services.map((item) => (
              <BloggerServiceItem data={item} blogger_id={blogger_id}/>
            ))}
          </div>
        </div>
        <div>
          <h5>Список предоставляемых услуг: </h5>
          <div className={styles.listAccessServices}>
            {bloggerSelector.current_services.map((item) => (
              <BloggerServiceItemEx data={item} blogger_id={blogger_id}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(BloggerService);
