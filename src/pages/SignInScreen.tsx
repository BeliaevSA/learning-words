import React, { useEffect, useState } from "react";
import styles from "../styles/SignInScreen.module.css";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router";
import { FieldValues, useForm } from "react-hook-form";
import { ICreateNewUser, createNewUser, fetchToken } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RotatingLines } from "react-loader-spinner";

export const SignInScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const errorFetch = useAppSelector(state => state.user.error);

  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  useEffect(() => {
    switch (errorFetch) {
      case 500:
        setErrorText("Данный логин занят, попробуйте ввести другой");
        break;

      default:
        setErrorText("Что-то пошло не так, попробуйте снова");
        break;
    }
  }, [errorFetch]);
  
  const headlerClickSignIn = async ({
    login,
    email,
    password,
  }: FieldValues) => {
    setLoading(true);
    setErrorText("");
    try {
    //получение токена админа для создания нового пользователя
    const dataTokenAdmin = {
      login: process.env.REACT_APP_ADMIN_USERNAME,
      password: process.env.REACT_APP_ADMIN_PASSWORD
    }
    const tokenAdmin = await dispatch(fetchToken(dataTokenAdmin));
    if(typeof tokenAdmin.payload !== 'string') {
      throw new Error('')
    }

    //создание нового пользователя
    const dataNewUser: ICreateNewUser = {
      username: login,
      password,
      email,
      tokenAdmin: tokenAdmin.payload
    }
    const newUser = await dispatch(createNewUser(dataNewUser))
    if(typeof newUser.payload !== 'object' ) {
      throw new Error('')
    }

    //получение токена созданного пользователя
    const tokenNewUser = await dispatch(fetchToken({login, password}));
    console.log(tokenNewUser)
    if(typeof tokenAdmin.payload !== 'string') {
      throw new Error('Данный логин занят, попробуйте ввести другой')
    }
      navigate("/home", {
        replace: true,
      });
    } catch (error) {
      console.log(error)
    }finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className={styles.container}>
      <Header title="Регистрация" toBack={true} />
      <form className={styles.form} onSubmit={handleSubmit(headlerClickSignIn)}>
        <div className={styles["input-wrapper"]}>
          <input
            className={styles.input}
            type="text"
            placeholder="Введите логин"
            {...register("login", {
              required: "Поле обязательно к заполнению",
              pattern: {
                value: /^[\dA-Za-z]+$/,
                message:
                  "Допускаются к вводу только латинские символы и цифры",
              },
            })}
          />
          {errors.login && (
            <p className={styles.error}>
              {errors.login?.message?.toString() ||
                "Что то пошло не так попробуйте снова"}
            </p>
          )}
        </div>
        <div className={styles["input-wrapper"]}>
          <input
            className={styles.input}
            type="email"
            placeholder="Введите email"
            {...register("email", {
              required: "Поле обязательно к заполнению",
            })}
          />
          {errors.email && (
            <p className={styles.error}>
              {errors.email?.message?.toString() ||
                "Что то пошло не так попробуйте снова"}
            </p>
          )}
        </div>
        <div className={styles["input-wrapper"]}>
          <input
            className={styles.input}
            type="password"
            placeholder="Введите пароль"
            {...register("password", {
              required: "Поле обязательно к заполнению",
              pattern: {
                value: /^[A-Za-z0-9-_@!]+$/,
                message:
                  "Допускаются к вводу только латинские символы, цифры, '-', '_', '@', '!'",
              },
            })}
          />
          {errors.password && (
            <p className={styles.error}>
              {errors.password?.message?.toString() ||
                "Что то пошло не так попробуйте снова"}
            </p>
          )}
        </div>
        {errorFetch && (
          <p className={styles.errorFetch}>{errorText}</p>
        )}
        <div className={styles.btns}>
        {loading ? (
            <div className={styles["btn-sign-up"]}>
              <RotatingLines
                strokeColor="white"
                animationDuration="0.75"
                width="14"
                visible={true}
              />
            </div>
          ) : (
          <input
            type="submit"
            value="Создать аккаунт"
            className={styles["btn-sign-up"]}
            disabled={!isValid}
          />)}
        </div>
      </form>
    </div>
  );
};
