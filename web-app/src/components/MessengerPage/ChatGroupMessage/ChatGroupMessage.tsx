import { FC, memo } from "react";
import styles from "./ChatGroupMessage.module.scss";
import jwtDecode from "jwt-decode";
import { useAppSelector } from "src/hooks/redux.hook";
import { IGroupMessage } from "src/models/messenger/IGroupChatModel";

export interface IChatMessageProps {
    message: IGroupMessage;
}

const ChatGroupMessage: FC<IChatMessageProps> = ({ message }) => {
  const authSlice = useAppSelector((selector) => selector.authReducer);
  const { users_id } = jwtDecode(authSlice.access_token as string) as { users_id: number };

  return (
    <>
        <div className={styles.container}>
            {
              message.users_id !== users_id && message.users_id &&
              <div className={styles.otherMessage}>
                <div className={styles.otherMessageHeader}>
                  <span>
                    {
                      message.user.users_data[0].nickname
                    }
                  </span>
                </div>
                <div className={styles.otherMessageContent}>
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
            {
              !message.users_id &&
              <div className={styles.notify}>
                <span>
                  {
                    message.text
                  }
                </span>
              </div>
            }
        </div>
    </>
  );
};

export default memo(ChatGroupMessage);
