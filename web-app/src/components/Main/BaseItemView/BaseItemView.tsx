import React, { FC, useEffect } from "react";
import styles from "./BaseItemView.module.scss";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import arrowLeft from "src/resources/images/arrow-left.svg";
import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";
import { useAppDispatch } from "src/hooks/redux.hook";
import { setToForm, setToMain } from "src/store/actions/NavigateAction";

export interface IBaseItemViewProps {
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

const BaseItemView: FC<any> = () => {
  const dispatch = useAppDispatch();

  const scrollToElement = () => {
    scroller.scrollTo("course", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  };

  useEffect(() => {
    scrollToElement();
  }, []);

  const location = useLocation().state as IBaseItemViewProps;
  const navigate = useNavigate();

  return (
    <>
      <Element name="course" className={styles.container}>
        <button
          className={styles.arrowLeft}
          onClick={() => {
            dispatch(setToMain({toMain: true}));
            navigate("/");
          }}
        >
          <img src={arrowLeft} alt="arrow left" />
        </button>
        <div className={styles.content}>
          <div className={styles.subcontent}>
            <div className={styles.header}>
              <p className={styles.title}>{location.title}</p>
              <p className={styles.tag}>{location.tag}</p>
            </div>
            <div className={styles.description}>
              <p className={styles.descriptionHeader}>Описание</p>
              <span className={styles.descriptionText} dangerouslySetInnerHTML={{ __html: location.description }}></span>
            </div>
            <div className={styles.format}>
              <p className={styles.formatHeader}>Формат</p>
              <span className={styles.formatText}>{location.format}</span>
            </div>
          </div>
          <div className={styles.subcontent}>
            <img className={styles.image} src={location.image} alt="img" />
            <div className={styles.form}>
              <p className={styles.price}>{location.price} ₽</p>
              <button 
                className={styles.formBtn}
                onClick={() => {
                  dispatch(setToForm({toForm: true}));
                  navigate("/");
                }}
              >Записаться</button>
            </div>
          </div>
        </div>
      </Element>
    </>
  );
};

export default React.memo(BaseItemView);
