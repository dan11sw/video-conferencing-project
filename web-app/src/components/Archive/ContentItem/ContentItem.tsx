import React, { FC, useState, useEffect } from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import PaidIcon from "@mui/icons-material/Paid";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import styles from "./ContentItem.module.css";
import { useLiveQuery } from "dexie-react-hooks";
import { db, resetDatabase } from "src/db/db";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { useAppDispatch } from "src/hooks/redux.hook";
import { IGetContentModel } from "src/models/IContentModel";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export interface IContentItemProps {
  content: IGetContentModel;
  select: IGetContentModel | null;
  setSelect: React.Dispatch<React.SetStateAction<IGetContentModel | null>>;
  setSelectBuy: React.Dispatch<React.SetStateAction<IGetContentModel | null>>;
}

const ContentItem: FC<IContentItemProps> = ({
  content,
  select,
  setSelect,
  setSelectBuy,
}) => {
  const dispatch = useAppDispatch();
  const [isFavourite, setFavourite] = useState(false);
  const favourites = useLiveQuery(() => db.favourites.toArray());

  /*(async () => {
    const objects = await db.favourites.where("uuid").equals(uuid).toArray();
    if (objects.length > 0) {
      setFavourite(true);
    }
  })();*/

  const declOfNum = (number: number, words: string[]) => {
    return words[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
    ];
  };

  /*const changeFavourite = async () => {
    const objects = await db.favourites.where("uuid").equals(uuid).toArray();

    if (objects.length > 0 && isFavourite) {
      await db.favourites.delete(objects[0].id as number);
      dispatch(
        messageQueueAction.addMessage(
          null,
          "dark",
          `Контент "${content.title}" удалён из избранного`
        )
      );
    } else if (objects.length === 0 && !isFavourite) {
      await db.favourites.add({
        uuid,
        img,
        title,
        price,
        count_files,
        type,
      });

      dispatch(
        messageQueueAction.addMessage(
          null,
          "success",
          `Контент "${title}" добавлен в избранное`
        )
      );
    }

    setFavourite(!isFavourite);
  };*/

  return (
    <>
      <ImageListItem key={content.path} sx={{ width: 320, height: 320 }}>
        <img
          src={`${content.path}?w=248&fit=crop&auto=format`}
          srcSet={`${content.path}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={content.title}
          loading="lazy"
        />
        <ImageListItemBar
          title={
            content.is_buy
              ? ""
              : `Цена: ${content.price} ${declOfNum(content.price as number, [
                  "токен",
                  "токена",
                  "токенов",
                ])}`
          }
          subtitle={
            "image" === "image"
              ? `Изображений: ${content.content_objects?.length}`
              : `Видеофайлов: ${content.content_objects?.length}`
          }
          actionIcon={
            content.is_buy ? (
              <>
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-label={`info about ${content.title}`}
                  onClick={() => {
                    setSelect(content);
                  }}
                >
                  <CheckCircleOutlineIcon />
                </IconButton>
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-label={`info about ${content.title}`}
                  onClick={() => {
                    setSelect(content);
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </>
            ) : (
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                aria-label={`info about ${content.title}`}
                onClick={() => {
                  setSelectBuy(content);
                }}
              >
                <PaidIcon />
              </IconButton>
            )
          }
        />
        <ImageListItemBar
          sx={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
              "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
          }}
          title={content.title}
          position="top"
          actionIcon={
            <IconButton
              sx={{ color: "white" }}
              aria-label={`star ${content.title}`}
            >
              {!isFavourite && <StarBorderIcon />}
              {isFavourite && <StarIcon />}
            </IconButton>
          }
          actionPosition="left"
        />
      </ImageListItem>
    </>
  );
};

export default React.memo(ContentItem);
