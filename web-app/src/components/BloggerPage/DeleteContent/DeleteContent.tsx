import React, { FC, useEffect, useState } from "react";
import styles from "./DeleteContent.module.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import CircularIndeterminate from "src/components/CircularIndeterminate/CircularIndeterminate";
import { IGetContentModel } from "src/models/IContentModel";
import { deleteContent } from "src/store/actions/blogger/BloggerAction";

export interface ICreateContentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: IGetContentModel | null;
  setSelect: React.Dispatch<React.SetStateAction<IGetContentModel | null>>;
}

const DeleteContent: FC<ICreateContentProps> = ({
  open,
  setOpen,
  content,
  setSelect,
}) => {
  const bloggerSelector = useAppSelector((reducer) => reducer.bloggerReducer);
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelect(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onDeleteContent = () => {
    dispatch(deleteContent({ content_sales_id: content?.id }, handleClose));
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          {bloggerSelector.isLoading && <CircularIndeterminate />}
          <DialogTitle>Удаление контента</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы уверены, что хотите удалить контент <b>{content?.title}</b>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Нет</Button>
            <Button onClick={onDeleteContent}>Да</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(DeleteContent);
