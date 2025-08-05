import React, { FC } from "react";
import styles from "./TeacherItem.module.scss";

export interface ITeacherItemProps {
    id: number;
    image: string;
    title: string;
    pointers: string[];
    description: string;
}

const TeacherItem: FC<ITeacherItemProps> = (props: ITeacherItemProps) => {
  return (
    <>
        <div className={styles.container}>
            <div className={styles.headerImage}>
                <img src={props.image} />
            </div>
            <div className={styles.content}>
                <h2 className={styles.title}>{props.title}</h2>
                <ul>
                    {
                        props.pointers && props.pointers.map((item) => {
                            return (
                                <li key={item}>{item}</li>
                            )
                        })
                    }
                </ul>
                <span className={styles.description}>{props.description}</span>
            </div>
        </div>
    </>
  );
};

export default React.memo(TeacherItem);