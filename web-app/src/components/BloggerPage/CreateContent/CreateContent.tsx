import React, { FC, useEffect, useState } from "react";
import styles from "./CreateContent.module.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ChangeRole from "../../AdminPage/ChangeRole/ChangeRole";
import { IRoleModel } from "src/models/IUserInfoModel";
import ImageUpload from "src/components/ImageUpload";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { createBlogger } from "src/store/actions/admin/AdminAction";
import CircularIndeterminate from "src/components/CircularIndeterminate/CircularIndeterminate";
import { dataURLToBlob, isDataURL } from "src/utils/file";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { createContent } from "src/store/actions/blogger/BloggerAction";

export interface ICreateContentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateContent: FC<ICreateContentProps> = ({ open, setOpen }) => {
  const bloggerSelector = useAppSelector((reducer) => reducer.bloggerReducer);
  const authSelector = useAppSelector((reducer) => reducer.authReducer);
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({
      title: "",
      description: "",
      price: "",
    });
    setImage([]);
    setImages([]);
  };

  const [contentType, setContentType] = React.useState("10");
  const [images, setImages] = React.useState<
    Array<{ data_url: string; file: File }>
  >([]);
  const [image, setImage] = React.useState<
    Array<{ data_url: string; file: File }>
  >([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setContentType(event.target.value);
  };

  // @ts-ignore
  const onChangeImage = (imageList) => {
    setImages(imageList);
  };

  // @ts-ignore
  const onChangeSingleImage = async (imageList, addUpdateIndex) => {
    setImage(imageList);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onCreateContent = () => {
    if (image.length === 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Необходимо добавить титульное изображение"
        )
      );
      return;
    }

    if (images.length === 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Необходимо добавить изображения контента"
        )
      );
      return;
    }

    if (
      form.title.length === 0 ||
      form.description.length === 0 ||
      form.price.length === 0
    ) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Необходимо добавить данные для контента (название, описание и цену)"
        )
      );
      return;
    }

    dispatch(
      createContent(
        form,
        image[0].file,
        images.map((item) => item.file),
        () => {
          handleClose();
        }
      )
    );
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          {bloggerSelector.isLoading && <CircularIndeterminate />}
          <DialogTitle>Создание нового контента</DialogTitle>
          <DialogContent>
            <DialogContentText>
              В данном блоке необходимо добавить все данные, чтобы можно было
              создать новый уникальный контент
            </DialogContentText>
            <br />
            <ImageUpload
              title={"Титульное изображение *"}
              subtitle={"Загрузить изображение"}
              value={image}
              onChange={onChangeSingleImage}
              multiple={false}
            />
            <br />
            <div className="input-field">
              <span>Название</span>
              <input
                id="title"
                type="text"
                name="title"
                className="yellow-input"
                onChange={onChange}
              />
            </div>
            <br />
            <div className="input-field">
              <span>Описание</span>
              <textarea
                id="description"
                name="description"
                className="yellow-input"
                onChange={onChange}
              />
            </div>
            <br />
            <div className="input-field">
              <span>Цена (в токенах)</span>
              <input
                id="price"
                type="number"
                name="price"
                className="yellow-input"
                onChange={onChange}
              />
            </div>
            <br />
            <ImageUpload
              title={"Изображения *"}
              subtitle={"Загрузить изображения"}
              value={images}
              onChange={onChangeImage}
              multiple={true}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={onCreateContent}>Создать контента</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(CreateContent);
