import React, { useEffect, useState } from "react";
import styles from "../styles/ViewAllCardsScreen.module.css";
import { Header } from "../components/Header";
import { ButtonBlock } from "../components/ButtonBlock";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { ITotalCards } from "../tipes";
import { fetchTotalWords, setTotalWords } from "../store/wordSlice";

export const ViewAllCardsScreen = () => {
  const totalWords = useAppSelector(state => state.words.totalWords);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const [totalCards, setTotalCards] = useState<ITotalCards[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCards = async () => {
    setLoading(true);
    const finishTotalWords = totalWords
      ? totalWords
      : (await dispatch(fetchTotalWords({token, userId}))).payload;
    if(finishTotalWords === undefined ) return
    dispatch(setTotalWords(finishTotalWords));
    let totalPages = Math.ceil(finishTotalWords / 30);

    console.log(totalPages);

    let arrTotalCards: ITotalCards[] = [];
    for (let i = 0; i < +totalPages; i++) {
      let startIndex = 1 + i * 30;
      let finishIndex =
        +finishTotalWords - 30 * (i + 1) > 0
          ? startIndex + 30 - 1
          : +finishTotalWords;
      arrTotalCards.push({ startIndex, finishIndex });
    }

    setTotalCards(arrTotalCards);
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Header title="Группы слов" toBack={true} />
      <div className={styles.body}>
        {!loading && totalWords < 1 && (
          <p className={styles.title}>Список слов пуст</p>
        )}
        {totalCards.map((card, index) => {
          return (
            <Link
              to={"/view-all-cards/view-cards"}
              state={{ page: index + 1 }}
              key={index}>
              <ButtonBlock
                title={`Слова: ${card.startIndex} - ${card.finishIndex}`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
