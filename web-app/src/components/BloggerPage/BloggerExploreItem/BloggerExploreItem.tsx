import React, { FC } from "react";
import styles from "./BloggerExploreItem.module.scss";
import { IGetContentModel } from "src/models/IContentModel";
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
import { useAppDispatch } from "src/hooks/redux.hook";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export interface BloggerExploreItemProps {
  item: IGetContentModel;
  select: IGetContentModel | null;
  setSelect: React.Dispatch<React.SetStateAction<IGetContentModel | null>>;
  setSelectEdit: React.Dispatch<React.SetStateAction<IGetContentModel | null>>;
  setSelectDelete: React.Dispatch<React.SetStateAction<IGetContentModel | null>>;
}

const BloggerExploreItem: FC<BloggerExploreItemProps> = ({
  item,
  select,
  setSelect,
  setSelectEdit,
  setSelectDelete
}) => {
  const declOfNum = (number: number, words: string[]) => {
    return words[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
    ];
  };

  return (
    <>
      <ImageListItem key={item.path} sx={{ width: 320, height: 320 }}>
        <img
          src={`${item.path}?w=248&fit=crop&auto=format`}
          srcSet={`${item.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={item.title}
          loading="lazy"
        />
        <ImageListItemBar
          title={`Цена: ${item.price} ${declOfNum(item.price as number, [
            "токен",
            "токена",
            "токенов",
          ])}`}
          subtitle={
            "image" === "image"
              ? `Изображений: ${item.content_objects?.length}`
              : `Видеофайлов: ${item.content_objects?.length}`
          }
          actionIcon={
            <>
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                aria-label={`info about ${item.title}`}
                onClick={() => {
                  setSelect(item);
                }}
              >
                <InfoIcon />
              </IconButton>

              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                aria-label={`info about ${item.title}`}
                onClick={() => {
                  setSelectEdit(item);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                aria-label={`info about ${item.title}`}
                onClick={() => {
                  setSelectDelete(item);
                }}
              >
                <DeleteIcon />
              </IconButton>
              {/*
                <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                aria-label={`info about ${item.title}`}
              >
                <MonetizationOnIcon />
              </IconButton>
                */}
            </>
          }
        />
        <ImageListItemBar
          sx={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
              "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
          }}
          title={item.title}
          position="top"
          actionPosition="left"
        />
      </ImageListItem>
    </>
  );
};

export default React.memo(BloggerExploreItem);
