import React, { FC } from "react";
import styles from "./Item.module.scss";

export interface IItemProps {
    title: string;
    description: string;
}

const Item: FC<IItemProps> = (props: IItemProps) => {
  return (
    <>
        <div className={styles.container}>
            <p className={styles.title}>{props.title}</p>
            <span className={styles.description} dangerouslySetInnerHTML={{ __html: props.description }}></span>
        </div>
    </>
  );
};

export default React.memo(Item);
