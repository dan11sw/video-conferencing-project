import { FC, useState, useEffect, memo, useRef } from "react";
import styles from "./ChatGroup.module.scss";
import { ICurrentChatModel } from "src/models/messenger/ICurrentChatModel";
import base1 from "src/resources/images/base1.jpg";
import ChatMessage from "../ChatMessage";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import socket from "src/socket";
import { IChatGroupModel } from "src/models/messenger/IGroupChatModel";
import ChatGroupMessage from "../ChatGroupMessage";
import ChatInput from "../ChatInput";

export interface IChatGroupProps {
  chat: IChatGroupModel | null;
}

const ChatGroup: FC<IChatGroupProps> = ({ chat }) => {
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
        {chat && (
          <div>
            <div className={styles.messages} ref={messagesRef}>
              {chat.messages.map((item) => (
                <ChatGroupMessage message={item} />
              ))}
            </div>
            <div className={styles.controls}>
              <ChatInput handleSendMessage={handleSendMessage} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(ChatGroup);
