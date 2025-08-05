import { FC, memo, useState } from "react";
import styles from "./ChatInput.module.scss";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker, { EmojiClickData } from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";

export interface IChatInputProps {
  handleSendMessage: (msg: string) => void;
}

const ChatInput: FC<IChatInputProps> = ({
  handleSendMessage: handeSendMessage,
}) => {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const [cursor, setCursor] = useState(0);

  const handleEmojiClick = (emoji: EmojiClickData, event: MouseEvent) => {
    let message = msg;
    if (!cursor) {
      message += emoji.emoji;
    } else {
      message =
        message.slice(0, cursor) +
        emoji.emoji +
        message.slice(cursor, message.length);
    }

    setMsg(message);
  };

  const sendChat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tMsg = msg.trim();
    if (tMsg.length > 0) {
      handeSendMessage(tMsg);
      setMsg("");
      setShowEmojiPicker(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form
          className={styles.inputContainer}
          onSubmit={(event) => sendChat(event)}
        >
          <input
            type="text"
            placeholder="Написать сообщение ..."
            onChange={(e) => setMsg(e.target.value)}
            onClick={(e) => {
              setCursor(e.currentTarget.selectionStart || 0);
            }}
            value={msg}
          />
          <div className={styles.buttonContainer}>
            <div className="emoji">
              <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
              {showEmojiPicker && (
                <div className={styles.pickerContainer}>
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </div>
          <IconButton type="submit">
            <SendIcon />
          </IconButton>
        </form>
      </div>
    </>
  );
};

export default memo(ChatInput);
