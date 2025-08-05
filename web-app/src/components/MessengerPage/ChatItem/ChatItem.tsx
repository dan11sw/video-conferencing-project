import { FC, memo } from "react";
import styles from "./ChatItem.module.scss";
import { IChatModel } from "src/models/messenger/IChatModel";

export interface IChatItemProps {
    chat: IChatModel;
    onRoomConnection: () => void;
};

/**
 * Информация о конкретном чате
 * @param param0 
 * @returns 
 */
const ChatItem: FC<IChatItemProps> = ({ chat, onRoomConnection }) => {
  return (
    <>
        <div className={styles.container}
            onClick={onRoomConnection}
        >
            <div className={styles.item}>
                <img src={chat.image} className={styles.image}/>
            </div>
            <div className={styles.item}>
                <div>{chat.nickname}</div>
                <div>{chat.last_message.slice(0, 22)}...</div>
            </div>
            <div className={styles.item}>
                <div>
                    {(new Date(chat.updated_at)).toLocaleDateString("ru-RU")}
                </div>
            </div>
        </div>
    </>
  );
};

export default memo(ChatItem);
