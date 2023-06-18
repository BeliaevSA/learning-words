import React, { useEffect, useState } from "react";
import styles from "../styles/ViewCardsScreen.module.css";
import { Grid } from "react-loader-spinner";
import { Header } from "../components/Header";
import { IWord } from "../tipes";
import { WordCard } from "../components/WordCard";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { fetchDataWords } from "../store/wordSlice";

export const ViewCardsScreen = () => {
  const dispatch = useAppDispatch()

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [dataWords, setDataWords] = useState<IWord[]>([]);
  const [showEng, setShow] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const location = useLocation();
  const { page } = location.state;

  const fetchWords = async () => {
    setLoading(true);

    const response = (await dispatch(fetchDataWords({ page, token, userId, perPage: 30 }))).payload

    const data: IWord[] = response.map((word: any) => ({
      id: word.id,
      wordEn: word.title.rendered,
      wordRu: word.acf.wordRu,
    }));
    setDataWords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const changeLang = () => {
    setShow(!showEng);
    showParams();
  };

  const hadlerSort = () => {
    let sortDataWords = dataWords
    sortDataWords.sort(() => Math.random() - 0.5)
    setDataWords(sortDataWords)
    setShowOptions(false)
  }

  const classNameOptions = showOptions
    ? [styles.options, styles.active].join(" ")
    : styles.options;

  const showParams = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className={styles.container}>
      <Header
        title="Все карточки"
        toBack={true}
        paramsIcon="cards"
        headlerClickParams={showParams}
      />
      <div className={styles.body}>
        <div className={classNameOptions}>
          <button className={styles["options-btn"]} onClick={hadlerSort}>
            Перемешать
          </button>
          <button
            className={styles["options-btn"]}
            onClick={changeLang}>
            Смена языка
          </button>
        </div>
        {loading && (
          <div className={styles.loader}>
            <Grid
              height="70"
              width="70"
              color="#ffffff"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        )}
        <div>
          {dataWords &&
            dataWords.map(word => {
              return (
                <WordCard
                  word={word}
                  key={word.id}
                  showEng={showEng}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
