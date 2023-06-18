import React, { FC, useEffect, useState } from "react";
import styles from "../styles/WordCard.module.css";
import { IWord } from "../tipes";

interface IWordCardProps {
  word: IWord;
  showEng: boolean;
}

export const WordCard: FC<IWordCardProps> = ({ word, showEng }) => {
  const [showWordEn, setShowWordEn] = useState(false);
  const [showWordRu, setShowWordRu] = useState(false);

  useEffect(() => {
    if (showEng) {
      setShowWordEn(true);
      setShowWordRu(false);
    }
    if (!showEng) {
      setShowWordRu(true);
      setShowWordEn(false);
    }
  }, [showEng]);

  const showTranslation = () => {
    showEng ? setShowWordRu(!showWordRu) : setShowWordEn(!showWordEn);
  };

  return (
    <div className={styles.container} onClick={showTranslation}>
      <div className={styles.word}>{showWordEn && word.wordEn}</div>
      <div className={[styles.word, styles.wordRu].join(" ")}>
        {showWordRu && word.wordRu}
      </div>
    </div>
  );
};
