import React, { FC } from "react";
import ImageList from "@mui/material/ImageList";
import ContentItem from "../ContentItem/ContentItem";
import styles from "./FavouriteContent.module.css";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "src/db/db";

const FavouriteContent: FC<any> = () => {
  const favourites = useLiveQuery(() => db.favourites.toArray());

  if(!favourites){
    return <></>;
  }

  return (
    <>
      <ImageList sx={{ width: "100%", height: "100%" }} gap={16} cols={4}>
        {/*favourites.map((item) => (
          <ContentItem {...item} />
        ))*/}
      </ImageList>
    </>
  );
};

export default React.memo(FavouriteContent);
