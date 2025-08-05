import React, { FC, useState, useEffect } from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import PaidIcon from "@mui/icons-material/Paid";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { useLiveQuery } from "dexie-react-hooks";
import { db, resetDatabase } from "src/db/db";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import styles from "./ContentItemBuy.module.css";
import { IGetContentModel } from "src/models/IContentModel";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularIndeterminate from "src/components/CircularIndeterminate";
import { buyContent } from "src/store/actions/user/UserContentAction";

export interface IContentBuyProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: IGetContentModel | null;
  setSelect: React.Dispatch<React.SetStateAction<IGetContentModel | null>>;
}

const ContentBuy: FC<IContentBuyProps> = ({
  open,
  setOpen,
  content,
  setSelect,
}) => {
  const userContentReducer = useAppSelector(
    (reducer) => reducer.userContentReducer
  );
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelect(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onBuyContent = () => {
    dispatch(
      buyContent(
        {
          content_sales_id: content?.id,
        },
        handleClose
      )
    );
  };

  const declOfNum = (number: number, words: string[]) => {
    return words[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
    ];
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          {userContentReducer.isLoading && <CircularIndeterminate />}
          <DialogTitle>Покупка контента</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы уверены, что хотите купить контент <b>{content?.title}</b> за{" "}
              {content?.price}{" "}
              {declOfNum(content?.price as number, [
                "токен",
                "токена",
                "токенов",
              ])}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={onBuyContent}>Купить</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(ContentBuy);
