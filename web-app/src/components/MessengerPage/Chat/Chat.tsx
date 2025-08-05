import { FC, useState, useEffect, memo, useRef } from "react";
import styles from "./Chat.module.scss";
import { ICurrentChatModel } from "src/models/messenger/ICurrentChatModel";
import base1 from "src/resources/images/base1.jpg";
import ChatMessage from "../ChatMessage";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import socket from "src/socket";
import ChatInput from "../ChatInput";

export interface IChatProps {
  chat: ICurrentChatModel | null;
}

const Chat: FC<IChatProps> = ({ chat }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (msg: string) => {
    if (chat) {
      socket.emit("send_message", {
        text: msg,
        rooms_uuid: chat.rooms_uuid,
      });

      if (inputRef.current !== null) {
        inputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (messagesRef.current !== null) {
      messagesRef.current.scroll({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat]);

  return (
    <>
      <div className={styles.container}>
        {!chat && (
          <div className={styles.empty_text}>
            <h3>Выберите пользователя чтобы начать общение</h3>
          </div>
        )}
        {chat && (
          <div>
            <div className={styles.header}>
              <img src={base1} className={styles.icon} />
              <span>{chat.user.users_data[0].nickname}</span>
            </div>
            <div className={styles.messages} ref={messagesRef}>
              {chat.messages.map((item) => (
                <ChatMessage message={item} />
              ))}
            </div>
            <div className={styles.controls}>
              <ChatInput handleSendMessage={handleSendMessage}/>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(Chat);
