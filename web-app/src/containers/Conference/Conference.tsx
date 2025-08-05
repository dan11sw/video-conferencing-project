import React, { FC } from "react";
import styles from "./Conference.module.css";
import RoomView from "../RoomView";

const Conference: FC<any> = () => {
  return (
    <>
        <RoomView />
    </>
  );
};

export default React.memo(Conference);
