import React, { FC } from "react";
import Image from 'next/image';
import styles from "./AnonCard.module.css";

export const AnonCard: FC<{name: string, image: string}> = ({name, image}) => {
  return (
    <div className={styles.card}>
      <Image
        alt={name}
        src={image}
        width={200}
        height={200}
      />
      <h3>{name}</h3>
    </div>
  );
};
