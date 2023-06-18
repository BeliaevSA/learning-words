import { FC } from "react";
import styles from "../styles/Header.module.css";
import { BiArrowBack } from "react-icons/bi";
import { GrConfigure } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";

interface IHeaderProps {
  title: string;
  toBack?: boolean;
  paramsIcon?: "cards" | "logout";
  headlerClickParams?: () => void;
}

export const Header: FC<IHeaderProps> = ({
  title,
  toBack,
  paramsIcon,
  headlerClickParams,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      {toBack && (
        <BiArrowBack
          className={styles.iconBack}
          onClick={handleClick}
        />
      )}
      <p className={styles.title}>{title}</p>
      {paramsIcon === "cards" && (
        <GrConfigure
          className={styles.iconParams}
          onClick={headlerClickParams}
        />
      )}
      {paramsIcon === "logout" && (
        <MdOutlineLogout
          className={styles.iconParams}
          onClick={headlerClickParams}
        />
      )}
    </div>
  );
};
