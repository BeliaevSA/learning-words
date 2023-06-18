import React, { useEffect, useState } from "react";
import styles from "../styles/SignUpScreen.module.css";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Button } from "../components/Button";
import { fetchTotalWords } from "../store/wordSlice";
import { Header } from "../components/Header";
import { fetchToken, fetchUser } from "../store/userSlice";
import { RotatingLines } from "react-loader-spinner";

export const SignUpScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  useEffect(() => {
    switch (errorFetch) {
      case 403:
        setErrorText("Неверный логин или пароль");
        break;

      default:
        setErrorText("Что-то пошло не так, попробуйте снова");
        break;
    }
  }, [errorFetch]);

  // console.log(typeof process.env.REACT_APP_ADMIN_USERNAME)
  const headlerClickSignUp = async ({
    login,
    password,
  }: FieldValues) => {
    setLoading(true);
    setErrorText("");
    try {
      await dispatch(fetchToken({ login, password }));
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('Неверный логин или пароль')
      }
      await dispatch(fetchUser({ token, login }));
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error('неверный регистр')
      }
      await dispatch(fetchTotalWords({ token, userId }));
      navigate("/home", {
        replace: true,
      });
    } catch (error: any) {
      setErrorText(error.message);
    } finally {
      setLoading(false);
    }
    reset();
  };

  const headlerClickSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <div className={styles.container}>
      <Header title="Вход" />
      <form
        className={styles.form}
        onSubmit={handleSubmit(headlerClickSignUp)}>
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
              value="Войти"
              className={styles["btn-sign-up"]}
              disabled={!isValid}
            />
          )}
          <input
            type="button"
            value="Создать аккаунт"
            className={styles["btn-sign-in"]}
            onClick={headlerClickSignIn}
          />
        </div>
      </form>
    </div>
  );
};
