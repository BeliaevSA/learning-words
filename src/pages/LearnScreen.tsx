import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../styles/LearnScreen.module.css';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchDataWords, fetchTotalWords } from '../store/wordSlice';
import { useLocation } from 'react-router-dom';
import { IWord } from '../tipes';
import { Header } from '../components/Header';
import { BallTriangle } from 'react-loader-spinner';
import { EnteredLetter } from '../components/EnteredLetter';

export interface ILetter {
  value: string,
  isVisible: boolean
}


export const LearnScreen = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { perPage } = location.state;
  const totalWords = useAppSelector(state => state.words.totalWords)
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);

  const [dataWords, setDataWords] = useState<IWord[]>([]); //слова после запроса fetchWords
  const [learnDataWords, setLearnDataWords] = useState<IWord[]>([]) //слова для изучения, список будет изменяться
  const [word, setWord] = useState<IWord | null>(null); // слово 
  const [offsetOne, setOffsetOne] = useState<number>(0); // номер слова для повторения слова
  const [result, setResult] = useState<'Правильно' | 'Не правильно' | ''>('') // правильность ввода слова
  const [changeWord, setChangeWord] = useState(1) // изменение слова
  const [showTranslation, setShowTranslation] = useState(false); // введеные буквы
  const [enteredWord, setEnteredWord] = useState(''); // введеные буквы
  const [showLetters, setShowLetters] = useState<ILetter[]>([]); // буквы для ввода

  const allLetters = 'abcdifghijklmnopqrstuvwxyz'.split('');

  // получение слов для изучения
  const fetchWords = async () => {
    setLoading(true);
    const response = await dispatch(fetchDataWords({ token, userId, perPage }));
    const dataWords: IWord[] = response.payload.map((word: any) => {
      return {
        id: word.id,
        author: word.author,
        wordEn: word.title.rendered,
        wordRu: word.acf.wordRu,
      };
    });

    setDataWords(dataWords);
    const sortDataWords = [...sortArr(dataWords)]
    setLearnDataWords(sortDataWords)
    const word: IWord = sortDataWords.splice(0, 1)[0]
    setWord(word);
    const sortAllLetters: ILetter[] = showLettersForEntered(word);
    setShowLetters(sortAllLetters);
    setLoading(false);
  };

  //получение двух случайных слов для изучения
  const fethTwoWords = async () => {
    setLoading(true);
    const newTotalWords = totalWords ? totalWords : (await dispatch(fetchTotalWords({ token, userId }))).payload
    if (!newTotalWords) return

    let offsetOne = Math.floor(Math.random() * (newTotalWords - 1))
    if (offsetOne < 0) {
      offsetOne++

    }
    setOffsetOne(offsetOne)
    const responseOne = await dispatch(fetchDataWords({ token, userId, perPage, offset: offsetOne }));
    const wordOne: IWord[] = responseOne.payload.map((word: any) => {
      return {
        id: word.id,
        author: word.author,
        wordEn: word.title.rendered,
        wordRu: word.acf.wordRu,
      };
    })
    setWord(wordOne[0])

    let offsetTwo = Math.floor(Math.random() * (newTotalWords - 1))
    if ((offsetTwo === offsetOne && newTotalWords > 1) || offsetTwo < 0) {
      offsetTwo < 0 ? offsetTwo++ : offsetTwo--
    }
    const responseTwo = await dispatch(fetchDataWords({ token, userId, perPage, offset: offsetTwo }));
    const wordTwo: IWord[] = responseTwo.payload.map((word: any) => {
      return {
        id: word.id,
        author: word.author,
        wordEn: word.title.rendered,
        wordRu: word.acf.wordRu,
      };
    })
    setLearnDataWords(wordTwo)

    const sortAllLetters: ILetter[] = showLettersForEntered(wordOne[0]);
    setShowLetters(sortAllLetters);
    setLoading(false);


  }

  //отображение букв для ввода слов
  const showLettersForEntered = (word: IWord) => {
    if (!word) return [];
    let sortAllLetters = sortArr(allLetters).join('');
    let learnWord = word.wordEn + sortAllLetters;
    const arrLetters =
      word.wordEn.length > 20 ? word.wordEn : learnWord.slice(0, 20);
    const result: ILetter[] = arrLetters.split('').map(value => {
      return {
        value, isVisible: true
      }
    })
    const sortResult = sortArr(result);
    return sortResult;
  };

  //получение нового слова
  const handlerClickNextWord = async () => {

    const sortLearnDataWords = sortArr(learnDataWords)
    const newWord = sortLearnDataWords.splice(0, 1)[0]
    setWord(newWord);
    const sortAllLetters: ILetter[] = showLettersForEntered(newWord);
    setShowLetters(sortAllLetters);
    setShowTranslation(false)
    setEnteredWord('')
    setResult('')
    if (perPage > 1 && learnDataWords.length === 0) {
      setLearnDataWords([...dataWords])
    }

    if (perPage === 1) {
      let offsetTwo = Math.floor(Math.random() * (totalWords - 1))
      if ((offsetTwo === offsetOne && totalWords > 1) || offsetTwo < 0) {
        offsetTwo < 0 ? offsetTwo++ : offsetTwo--
      }

      const responseTwo = await dispatch(fetchDataWords({ token, userId, perPage, offset: offsetTwo }));
      const wordTwo: IWord[] = responseTwo.payload.map((word: any) => {
        return {
          id: word.id,
          author: word.author,
          wordEn: word.title.rendered,
          wordRu: word.acf.wordRu,
        };
      })
      setLearnDataWords(wordTwo)
    }
  }

  useEffect(() => {
    perPage === 1 ? fethTwoWords() : fetchWords()
  }, []);

  useEffect(() => {
    if (result === 'Правильно') {
      setTimeout(handlerClickNextWord, 1000)
    }
  }, [result])


  //перемешивание в случайном порядке
  const sortArr = <T extends ILetter[] | string[] | IWord[],>(arr: T): T => {
    let sortArr = arr;
    sortArr.sort(() => Math.random() - 0.5);
    return sortArr;
  };

  //обработчик клика по буквамм
  const handlerClickLetter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (result) return
    setChangeWord(pre => pre + 1)
    const target = e.target as HTMLElement;
    let newLetter = target.textContent;
    if (newLetter) {
      if (newLetter === '_') newLetter = ' ';
      setEnteredWord((pre) => pre + newLetter)
    }
    if (word?.wordEn.length === enteredWord.length + 1) {
      word.wordEn === enteredWord + newLetter ? setResult("Правильно") : setResult("Не правильно")
    }
  };

  //очистка слова
  const deleteLetter = () => {
    setEnteredWord('')
    if (word) {
      const sortAllLetters = showLettersForEntered(word);
      setShowLetters(sortAllLetters);
      setResult('')
    }
  }

  const handlerClickShowTranslation = () => {
    setShowTranslation(pre => !pre)
  }


  return (
    <div className={styles.container}>
      <Header title="Слова" toBack={true} />
      {loading && (
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#eff1ef"
          ariaLabel="ball-triangle-loading"
          visible={true}
        />
      )}
      {!loading && (
        <div className={styles.body}>
          <div className={styles['word-wrapper']}>
            <div
              className={`${styles.word} ${showTranslation ? styles['translation'] : ''}`}
            >
              {word?.wordRu}
            </div>
            <div
              className={`${styles['word-back']} ${showTranslation ? styles['translation'] : ''}`}
            >
              {word?.wordEn}
            </div>
            {changeWord && <div className={styles.letters} onClick={deleteLetter}>{enteredWord}</div>}
            {result && <div className={styles['result-wrapper']}>
              <div className={styles.result} style={result === 'Правильно' ? { color: 'green' } : undefined}>{result}</div>
              {result === 'Не правильно' && <div className={styles['other-button']} onClick={handlerClickShowTranslation}>Показать перевод</div>}
            </div>}
          </div>
          <div className={styles['entered-wrapper']}>
            {showLetters?.map((letter, index) => (
              <EnteredLetter
                key={index}
                letter={letter}
                handlerClickLetter={handlerClickLetter}
                result={result}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
