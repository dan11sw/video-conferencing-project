import React, { FC } from "react";
import styles from "./BaseItem.module.scss";
import { useNavigate } from "react-router-dom";

export interface IBaseItemProps {
  id: number;
  imageShort: string;
  image: string;
  title: string;
  descriptionShort: string;
  description: string;
  price: number;
  tag: string;
  format: string;
}

const BaseItem: FC<IBaseItemProps> = (props: IBaseItemProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerImage}>
          <img src={props.imageShort} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{props.title}</h2>
          <span className={styles.description}>{props.descriptionShort}</span>
          <div className={styles.priceBlock}>
            <p className={styles.price}>{props.price} ₽</p>
            <button 
                className={styles.moreBtn} 
                onClick={() => {
                    navigate(`/courses/${props.id}`, { state: props })
                }}>
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(BaseItem);
