import React, { FC } from "react";
import styles from "./HeaderMenu.module.scss";

import logo from "src/resources/images/logo.svg";
import menuClose from "src/resources/images/menu-close.svg";

export interface IHeaderMenuProps {
  setMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderMenu: FC<IHeaderMenuProps> = (props: IHeaderMenuProps) => {
  return (
    <>
      <header className={styles.header}>
        <img className={styles.logo} src={logo} alt="logo" />
        <button 
          className={styles.headerMenuBtn}
          onClick={() => {
            props.setMenu(false);
          }}
        >
          <img src={menuClose} alt="menu" />
          <p>Меню</p>
        </button>
      </header>
    </>
  );
};

export default React.memo(HeaderMenu);
