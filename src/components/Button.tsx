import React, { FC } from "react";
import styles from "../styles/Button.module.css";
import { RotatingLines } from "react-loader-spinner";

interface IButtonProps {
  value: string;
  styleName: string;
  loading?: boolean;
  headlerClick: () => void;
}

export const Button: FC<IButtonProps> = ({
  value,
  styleName,
  loading,
  headlerClick,
}) => {
  return (
    <button className={styles[styleName]} onClick={headlerClick}>
      {loading ? (
        <RotatingLines
          strokeColor="white"
          // strokeWidth="5"
          animationDuration="0.75"
          width="16"
          visible={true}
        />
      ) : (
        value
      )}
    </button>
  );
};
