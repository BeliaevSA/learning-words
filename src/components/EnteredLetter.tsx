import React, { FC, useEffect, useState } from 'react'
import styles from '../styles/EnteredLetter.module.css'
import { ILetter } from '../pages/LearnScreen'

interface IEnteredLetterProps {
  handlerClickLetter: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  letter: ILetter
  result: string
}

export const EnteredLetter: FC<IEnteredLetterProps> = ({ handlerClickLetter, letter, result }) => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(letter.isVisible ? false : true)
  }, [letter])

  const enteredLetter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (result) return
    handlerClickLetter(e)
    setIsActive(() => !isActive)
  }

  return (
    <div
      className={`${styles.letter} ${isActive ? styles.active : ''}`}
      onClick={enteredLetter}
    >
      {letter.value === ' ' ? '_' : letter.value}
    </div>
  )
}
