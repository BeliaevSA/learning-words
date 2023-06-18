import { Link, useNavigate } from "react-router-dom";
import { ButtonBlock } from "../components/ButtonBlock";
import { Header } from "../components/Header";
import styles from "../styles/HomeScreen.module.css";
import { useAppSelector } from "../hooks";
import { useEffect } from "react";

export const HomeScreen = () => {
  const totalWords = useAppSelector(state => state.words.totalWords);
  const totalCards = useAppSelector(state => state.words.totalCards);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    localStorage.removeItem("userId");
    navigate("/sign-up", {
      replace: true,
    });
  };

  useEffect(() => {
    if (!token) {
      navigate("/sign-up", {
        replace: true,
      });
    }
  });

  console.log(totalWords);

  return (
    <div className={styles.container}>
      <Header
        title="Учим Слова"
        paramsIcon="logout"
        headlerClickParams={logout}
      />
      <Link to={"/start-learning"}>
        <ButtonBlock title="Начать изучение" value="startLearn" />
      </Link>
      <Link to={"/add-card"}>
        <ButtonBlock title="Добавить карточку" value="addCard" />
      </Link>
      <Link to={"/view-all-cards"} state={totalCards}>
        <ButtonBlock title="Колоды карточек" value="allCards" />
      </Link>
    </div>
  );
};
