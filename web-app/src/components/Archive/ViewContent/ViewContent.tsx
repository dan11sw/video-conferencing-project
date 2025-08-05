import React, { FC } from "react";
import styles from "./ViewContent.module.scss";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ImageGallery from "react-image-gallery";
import { IGetContentModel } from "src/models/IContentModel";

export interface IViewContentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: IGetContentModel | null;
  setSelect: React.Dispatch<React.SetStateAction<IGetContentModel | null>>;
}

const ViewContent: FC<IViewContentProps> = ({ open, setOpen, content, setSelect }) => {
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelect(null);
  };

  const images = content?.content_objects?.map((item) => {
    return {
      original: item.path as string,
      thumbnail: item.path as string,
    };
  }) || [];

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{content?.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{content?.description}</DialogContentText>
            <br />
            <ImageGallery items={images} showBullets={true} showIndex={true} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Назад</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(ViewContent);
