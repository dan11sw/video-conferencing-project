import React, { FC, useEffect, useState } from "react";
import styles from "./EditContent.module.css";
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
import { BlobToFile, dataURLToBlob, isDataURL } from "src/utils/file";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { createContent, updateContent } from "src/store/actions/blogger/BloggerAction";
import { IGetContentModel } from "src/models/IContentModel";

export interface ICreateContentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: IGetContentModel | null;
  setSelect: React.Dispatch<React.SetStateAction<IGetContentModel | null>>;
}

const EditContent: FC<ICreateContentProps> = ({
  open,
  setOpen,
  content,
  setSelect,
}) => {
  const bloggerSelector = useAppSelector((reducer) => reducer.bloggerReducer);
  const authSelector = useAppSelector((reducer) => reducer.authReducer);
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const [disable, setDisable] = useState(true);

  const handleClose = () => {
    setOpen(false);
    setSelect(null);
  };

  const [contentType, setContentType] = React.useState("10");
  const [images, setImages] = React.useState<
    Array<{ data_url: string; file?: File }>
  >(
    content?.content_objects?.map((item) => {
      return {
        data_url: item?.path as string,
      }
    }) || []
  );

  const [image, setImage] = React.useState<
    Array<{ data_url: string; file?: File }>
  >([
    {
      data_url: content?.path as string,
    },
  ]);

  const [form, setForm] = useState({
    title: content?.title || "",
    description: content?.description || "",
    price: (content?.price)? content?.price as unknown as string : "",
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });

    setDisable(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setContentType(event.target.value);
  };

  // @ts-ignore
  const onChangeMultipleImage = (imageList) => {
    setImages(imageList);
  };

  // @ts-ignore
  const onChangeSingleImage = async (imageList, addUpdateIndex) => {
    setDisable(false);
    setImage(imageList);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onUpdateContent = () => {
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
      updateContent(
        {
          ...form,
          content_sales_id: content?.id as number
        },
        (image[0].file)? image[0].file as File : null,
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
          <DialogTitle>Редактирование контента</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
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
                defaultValue={content?.title}
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
                defaultValue={content?.description}
                onChange={onChange}
              />
            </div>
            <br />
            <div className="input-field">
              <span>Цена (в токенах)</span>
              <input
                id="price"
                type="text"
                name="price"
                className="yellow-input"
                defaultValue={content?.price}
                onChange={onChange}
              />
            </div>
            <br />
            <ImageUpload
              title={"Изображения *"}
              subtitle={"Загрузить изображения"}
              value={images}
              onChange={onChangeMultipleImage}
              multiple={true}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={onUpdateContent} disabled={disable}>
              Изменить
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(EditContent);
