import React from "react";
import styles from "../styles/StartLearningScreen.module.css";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { ButtonBlock } from "../components/ButtonBlock";

export const StartLearningScreen = () => {
  return (
    <div className={styles.container}>
      <Header title="Начать изучение" toBack={true} />
      <Link to={"/start-learning/words"} state={{ perPage: 5 }}>
        <ButtonBlock title="Изучать" value="stydy" />
      </Link>
      <Link to={"/start-learning/words"} state={{ perPage: 15 }}>
        <ButtonBlock title="Закреплять" value="repeat" />
      </Link>
      <Link to={"/start-learning/words"} state={{ perPage: 1 }}>
        <ButtonBlock title="Повторять" value="random" />
      </Link>
    </div>
  );
};
