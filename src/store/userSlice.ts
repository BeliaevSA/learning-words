import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../tipes';
import axios from 'axios';

interface IUserState {
  error: number | null | undefined;
  user: IUser;
  token: string;
}

const initialState: IUserState = {
  error: null,
  user: { userId: null, login: '' },
  token: '',
};

interface IFetchToken {
  login: string | undefined;
  password: string | undefined;
}

interface IFetchUser {
  token: string | null;
  login: string;
}

export interface ICreateNewUser {
  username: string;
  password: string;
  email: string;
  tokenAdmin: string;
}

const URL = process.env.REACT_APP_WORDPRESS_REST_API;

export const fetchToken = createAsyncThunk<
  string,
  IFetchToken,
  { rejectValue: number }
>('user/fetchToken', async function (user: IFetchToken, { rejectWithValue }) {
  localStorage.removeItem('token');
  const token = await axios
    .post(`${URL}wp-json/jwt-auth/v1/token`, {
      username: user.login,
      password: user.password,
    })
    .then((res) => {
      localStorage.setItem('token', res.data.token);
      return res.data.token;
    })
    .catch((error) => {
      console.log('ошибка токена');
      return rejectWithValue(error.response.status);
    });
  console.log(token);
  return token;
});

export const fetchUser = createAsyncThunk<
  IUser,
  IFetchUser,
  { rejectValue: number }
>('user/fetchUser', async function (user: IFetchUser, { rejectWithValue }) {
  const { login, token } = user;
  const response = await axios
    .get(`${URL}wp-json/wp/v2/users?search=${login}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const getUser = res.data.find(
        (user: any) => user.name === login.toLocaleLowerCase()
      );
      const user: IUser = {
        userId: getUser.id,
        login: getUser.name,
      };

      localStorage.setItem('login', user.login);
      localStorage.setItem('userId', JSON.stringify(user.userId));
      return user;
    })
    .catch((error) => {
      console.log('ошибка токена');
      return rejectWithValue(error.response.status);
    });
  console.log(response);
  return response;
});

export const createNewUser = createAsyncThunk<
  IUser,
  ICreateNewUser,
  { rejectValue: number }
>(
  'user/createNewhUser',
  async function (data: ICreateNewUser, { rejectWithValue }) {
    const dataUser = {
      username: data.username.toLocaleLowerCase(),
      email: data.email,
      password: data.password,
      roles: ['administrator'],
    };

    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.tokenAdmin}`,
      },
    };

    const response = await axios
      .post(`${URL}wp-json/wp/v2/users`, JSON.stringify(dataUser), options)
      .then((res) => {
        const user: IUser = {
          userId: res.data.id,
          login: res.data.name,
        };

        localStorage.setItem('login', user.login);
        localStorage.setItem('userId', JSON.stringify(user.userId));
        return user;
      })
      .catch((error) => {
        console.log(error.message);
        return rejectWithValue(error.response.status);
      });

    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUserState>) {
      state.user = action.payload.user;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchToken.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createNewUser.pending, (state) => {
        state.error = null;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
