import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { ITotalCards } from "../tipes";
import axios from "axios";

interface IWordsState {
  error: number | null | undefined;
  totalWords: number;
  totalCards: ITotalCards[];
}

interface IFetchTotalWords {
  token: string | null;
  userId: string | null;
}

export interface IAddNewWord {
  wordEn: string,
  wordRu: string,
  userId: string | undefined
}

interface IDataWord {
  title: string;
  acf: {
      wordRu: string;
  };
  author: string | undefined;
  status: string;
}

interface IFetchDataWords {
  token: string | null;
  userId: string | null;
  page?: string
  perPage?: number
  offset?: number
}

const initialState: IWordsState = {
  error: null,
  totalWords: 0,
  totalCards: [{ startIndex: 0, finishIndex: 0 }],
};

const URL =  process.env.REACT_APP_WORDPRESS_REST_API

export const fetchTotalWords = createAsyncThunk<
  number,
  IFetchTotalWords,
  { rejectValue: number }
>("user/fetchTotalWords", async function (data, { rejectWithValue }) {
  const { token, userId } = data;
  const response = await axios
    .get(
      `${URL}wp-json/wp/v2/words?author=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(res => res.headers["x-wp-total"])
    .catch(error => rejectWithValue(error.message));
  console.log(response);
  return response;
});

export const createNewWord = createAsyncThunk<
  IDataWord,
  IAddNewWord,
  { rejectValue: number }
>("user/createNewWord", async function (data, { rejectWithValue }) {
  const dataWord: IDataWord = {
    title: data.wordEn.toLocaleLowerCase(),
    acf: { wordRu: data.wordRu.toLocaleLowerCase() },
    author: data.userId,
    status: "publish",
  };

  console.log(dataWord)

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  axios
    .post(
      `${URL}wp-json/wp/v2/words`,
      JSON.stringify(dataWord),
      options
    )
    .then(res => console.log(res.data))
    .catch(error => rejectWithValue(error.message));
  return dataWord;
});

export const fetchDataWords = createAsyncThunk<
  any,
  IFetchDataWords,
  { rejectValue: number }
>("user/fetchDataWords", async function (data, { rejectWithValue }) {
  const response = await axios
      .get(
        `${URL}wp-json/wp/v2/words?per_page=${data.perPage}&author=${data.userId}&page=${data.page || 1}&offset=${data.offset || 0}`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      )
      .then(res => res.data)
      .catch(error => rejectWithValue(error.message));
  console.log(response);
  return response;
});

const wordSlice = createSlice({
  name: "words",
  initialState,
  reducers: {
    setTotalWords(state, action: PayloadAction<number>) {
      state.totalWords = action.payload;
    },
    setTotalCards(state, action: PayloadAction<ITotalCards[]>) {
      state.totalCards = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTotalWords.pending, state => {
        state.error = null;
      })
      .addCase(fetchTotalWords.fulfilled, (state, action) => {
        state.totalWords = action.payload;
      })
      .addCase(fetchTotalWords.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createNewWord.pending, state => {
        state.error = null;
      })
      .addCase(createNewWord.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setTotalWords, setTotalCards } = wordSlice.actions;

export default wordSlice.reducer;
