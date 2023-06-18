import React, { FC } from "react";
import styles from "../styles/ButtonBlock.module.css";
import { GiTeacher } from "react-icons/gi";
import { BiCommentAdd } from "react-icons/bi";
import { FaGraduationCap, FaListAlt } from "react-icons/fa";
import { MdLandscape } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";

interface IButtonBlockProps {
  title: string;
  value?: string;
}

export const ButtonBlock: FC<IButtonBlockProps> = ({
  title,
  value,
}) => {
  let icon;
  switch (value) {
    case "startLearn":
      icon = <GiTeacher className={styles.icon} />;
      break;
    case "addCard":
      icon = <BiCommentAdd className={styles.icon} />;
      break;
    case "allCards":
      icon = <FaListAlt className={styles.icon} />;
      break;
    case "stydy":
      icon = <FaGraduationCap className={styles.icon} />;
      break;
    case "repeat":
      icon = <MdLandscape className={styles.icon} />;
      break;
    case "random":
      icon = <FiRepeat className={styles.icon} />;
      break;

    default:
      break;
  }

  return (
    <div className={styles.container}>
      {icon}
      {title}
    </div>
  );
};
