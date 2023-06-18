import React, { useEffect, useState } from "react";
import styles from "../styles/LoadingDataScreen.module.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { fetchTotalWords } from "../store/wordSlice";

export const LoadingDataScreen = () => {
  const [styleName, setStyleName] = useState("title");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchData = async (userId: string | null) => {
    setTimeout(() => setStyleName("titleShow"), 1);
    if (userId) {
      await dispatch(fetchTotalWords({ token, userId }));
    }
    setTimeout(() => {
      setStyleName("titleOut");
      setTimeout(() => {
        userId
          ? navigate("home", {
            replace: true,
          })
          : navigate("sign-up", {
            replace: true,
          });
      }, 1000);
    }, 3000);
  };

  useEffect(() => {
    fetchData(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <p className={[styles.title, styles[styleName]].join(", ")}>
        Учим Слова
      </p>
    </div>
  );
};
