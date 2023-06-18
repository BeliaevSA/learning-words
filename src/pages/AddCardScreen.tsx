import React, { useState } from "react";
import styles from "../styles/AddCardScreen.module.css";
import axios from "axios";
import { Header } from "../components/Header";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { IAddNewWord, createNewWord, setTotalWords } from "../store/wordSlice";

export const AddCardScreen = () => {
  // const authorId = useAppSelector(state => state.user.user.userId);
  const userId = localStorage.getItem("userId");
  const totalWords = useAppSelector(state => state.words.totalWords);
  const dispatch = useAppDispatch();
  const [wordEn, setWordEn] = useState("");
  const [wordRu, setWordRu] = useState("");

  const navigate = useNavigate();

  const addNewWord = async () => {
    if (wordEn.trim() === "" || wordRu.trim() === "") return;

    setWordEn("");
    setWordRu("");

    const dataWord: IAddNewWord = {
      wordEn,
      wordRu,
      userId: userId?.toString(),
    };

    dispatch(createNewWord(dataWord))

    totalWords && dispatch(setTotalWords(+totalWords + 1));
  };

  const goBack = () => {
    navigate(-1);
  };

  const addNewWordEndExit = () => {
    goBack();
    addNewWord();
  };

  return (
    <div className={styles.container}>
      <Header title="Добавить карточку" toBack={true} />
      <input
        value={wordEn}
        onChange={e => setWordEn(e.target.value)}
        placeholder="Введите слово на английском"
        className={styles.input}
      />
      <input
        value={wordRu}
        onChange={e => setWordRu(e.target.value)}
        placeholder="Введите слово на русском"
        className={styles.input}
      />
      <div className={styles.footer}>
        <div className={styles['btns-save']}>
          <button
            onClick={addNewWordEndExit}
            className={styles.btnSave}>
            Сохранить и выйти
          </button>
          <button onClick={addNewWord} className={styles.btnSave}>
            Сохранить и продолжить
          </button>
        </div>
        <button onClick={goBack} className={styles.btnCancel}>
          Отмена
        </button>
      </div>
    </div>
  );
};
