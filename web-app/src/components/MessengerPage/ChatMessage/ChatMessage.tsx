import { FC, memo } from "react";
import styles from "./ChatMessage.module.scss";
import { IMessage } from "src/models/messenger/ICurrentChatModel";
import jwtDecode from "jwt-decode";
import { useAppSelector } from "src/hooks/redux.hook";

export interface IChatMessageProps {
    message: IMessage;
}

const ChatMessage: FC<IChatMessageProps> = ({ message }) => {
  const authSlice = useAppSelector((selector) => selector.authReducer);
  const { users_id } = jwtDecode(authSlice.access_token as string) as { users_id: number };

  return (
    <>
        <div className={styles.container}>
            {
              message.users_id !== users_id &&
              <div className={styles.otherMessage}>
                <span>
                  {
                    message.text
                  }
                </span>
                <span className={styles.date}>
                  {
                    (new Date(message.created_at)).toLocaleTimeString("ru-RU").slice(0, 5)
                  }
                </span>
              </div>
            }
            {
              message.users_id === users_id && 
              <div className={styles.message}>
                <span>
                  {
                    message.text
                  }
                </span>
                <span className={styles.date}>
                  {
                    (new Date(message.created_at)).toLocaleTimeString("ru-RU").slice(0, 5)
                  }
                </span>
              </div>
            }
        </div>
    </>
  );
};

export default memo(ChatMessage);
