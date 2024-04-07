import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ADDUSER_ARGS,
  ApiError,
  DELETEUSER_ARGS,
  GETUSERS_ARGS,
  Users,
} from '../shared/models/api';
import { User } from '../shared/models/models';
import { ADDUSER, DELETEUSER, GETUSERS, UPDATEUSER } from './api';
import { setCache } from './usersSlice';
import { RootState } from './store';

let abortController: AbortController | null = null;
const isUsers = (response: Users | ApiError): response is Users =>
  '_links' in response;

const isUser = (response: User | ApiError): response is User =>
  'name' in response;

// GET (cached)
export const getUsers = createAsyncThunk<
  { users: User[]; totalUsers: number },
  GETUSERS_ARGS,
  { rejectValue: string | Error }
>('users/getUsers', async (args, thunkAPI) => {
  let signal: AbortSignal | undefined;
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();
  signal = abortController.signal;

  const { getState } = thunkAPI;
  const cache = (getState() as RootState).users.cache;
  const cacheKey = JSON.stringify(args);
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response: Users | ApiError = await GETUSERS(args, signal);
    if (isUsers(response)) {
      const users = response?._embedded?.employeeList ?? [];
      const totalUsers = +(response?._links?.totalUsers?.href ?? 0);
      const payload = { users, totalUsers };
      thunkAPI.dispatch(setCache({ key: cacheKey, value: payload }));

      return payload;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || error.toString());
  } finally {
    abortController = null;
  }
});

// PUT
export const updateUser = createAsyncThunk<
  { user: User },
  User,
  { rejectValue: string | Error }
>('users/updateUser', async (args, thunkAPI) => {
  try {
    const user: User | ApiError = await UPDATEUSER(args);
    if (isUser(user)) {
      return { user };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || error.toString());
  }
});

// POST
export const addUser = createAsyncThunk<
  { user: User },
  ADDUSER_ARGS,
  { rejectValue: string | Error }
>('users/addUser', async (args, thunkAPI) => {
  try {
    const user: User | ApiError = await ADDUSER(args);
    if (isUser(user)) {
      return { user };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || error.toString());
  }
});

// DELETE
export const deleteUser = createAsyncThunk<
  { success: boolean },
  DELETEUSER_ARGS,
  { rejectValue: string | Error }
>('users/deleteUser', async (args, thunkAPI) => {
  try {
    const response: string | ApiError = await DELETEUSER(args);
    if (typeof response === 'string') {
      return { success: true };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || error.toString());
  }
});
