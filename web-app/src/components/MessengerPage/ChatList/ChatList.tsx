import { FC, memo } from "react";
import styles from "./ChatList.module.scss";
import { IChatModel } from "src/models/messenger/IChatModel";
import ChatItem from "../ChatItem";

export interface IChatListProps {
    chats: IChatModel[]
    onRoomConnection: (rooms_uuid: string) => void
}

/**
 * Список чатов пользователя
 * @param param0 
 * @returns 
 */
const ChatList: FC<IChatListProps> = ({ chats, onRoomConnection }) => {
  return (
    <>
        <div className={styles.container}>
            {
                chats.map((item) => 
                  <ChatItem 
                    chat={item} 
                    onRoomConnection={() => {
                      onRoomConnection(item.room_uuid);
                    }}
                  />
                )
            }
        </div>
    </>
  );
};

export default memo(ChatList);
