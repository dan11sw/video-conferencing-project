import React, { FC, useEffect, useState } from "react";
import styles from "./Main.module.scss";
import sealBig from "src/resources/images/seal-big.png";
import iceBig from "src/resources/images/ice-big.png";
import Item from "src/components/Main/Item/Item";
import { items } from "./mock.data";
import arrowDown from "src/resources/images/arrow-down.svg";
import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";
import { useLocation } from "react-router-dom";
import { empty } from "src/types/empty";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import {
  setToCourse,
  setToForm,
  setToMain,
  setToTeacher,
} from "src/store/actions/NavigateAction";
import ImageGallery from "react-image-gallery";
import RoomView from "../RoomView/RoomView";

export interface IMainProps {
  toForm: boolean | empty;
}

const Main: FC<any> = () => {
  return (
    <>
      <div className={styles.main}>
        <RoomView />
      </div>
    </>
  );
};

export default React.memo(Main);
