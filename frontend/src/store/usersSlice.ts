import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ADDUSER, DELETEUSER, GETUSERS, UPDATEUSER } from './api'; // Import your API function
import { User } from '../shared/models/models';
import { RootState } from './store';
import {
  ADDUSER_ARGS,
  ApiError,
  DELETEUSER_ARGS,
  GETUSERS_ARGS,
  Users,
} from '../shared/models/api';
import { UsersState } from '../shared/models/redux';

let abortController: AbortController | null = null;
const isUsers = (response: Users | ApiError): response is Users =>
  '_links' in response;

const isUser = (response: User | ApiError): response is User =>
  'name' in response;

// GET
export const getUsers = createAsyncThunk<
  { users: User[]; totalUsers: number },
  GETUSERS_ARGS,
  { rejectValue: string | Error }
>('users/getUsers', async (args, thunkAPI) => {
  let signal: AbortSignal | undefined;
  if (abortController) {
    // If there is a previous request, abort it
    abortController.abort();
  }

  // Create a new AbortController for the current request
  abortController = new AbortController();
  signal = abortController.signal;

  const { getState } = thunkAPI;
  const cache = (getState() as RootState).users.cache;
  const cacheKey = JSON.stringify(args);
  if (cache[cacheKey]) {
    return cache[cacheKey]; // Return cached data if available
  }

  try {
    const response: Users | ApiError = await GETUSERS(args, signal); // Pass signal to fetch

    if (isUsers(response)) {
      const users = response?._embedded?.employeeList ?? [];

      // Calculate the total number of users based on the last page URL
      let totalUsers = +(response?._links?.totalUsers?.href ?? 0);
      const payload = { users, totalUsers };
      // cache: set
      thunkAPI.dispatch(setCache({ key: cacheKey, value: payload }));

      return payload;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    // Reject the promise with the error message or the error object itself
    return thunkAPI.rejectWithValue(error.message || error.toString());
  } finally {
    // Cleanup: Reset abortController
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

/**
 * Users Slice
 */

const initialState: UsersState = {
  ids: [],
  entities: { users: {}, originalUsers: {} },
  totalUsers: 0, // Add totalUsers field to initial state
  status: 'idle',
  error: null,
  cache: {},
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ userId: number; field: string; value: string }>,
    ) => {
      const { userId, field, value } = action.payload;
      if (
        state.entities.users &&
        state.entities.users[userId] &&
        field in state.entities.users[userId]
      ) {
        (state.entities.users as any)[userId][field] = value;
      }
    },
    setCache: (state, action: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = action.payload;
      state.cache[key] = value;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        const { users, totalUsers } = action.payload;
        state.entities.users = {};
        state.entities.originalUsers = {};
        state.ids = [];
        users.forEach((user) => {
          state.entities.users[user.id] = user;
          state.entities.originalUsers[user.id] = user;
          state.ids.push(user.id);
        });

        state.totalUsers = totalUsers;
      })
      // invalidate cache: called on POST, PUT, DELETE
      .addCase(addUser.fulfilled, (state, action) => {
        return { ...state, cache: {} };
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        return { ...state, cache: {} };
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        return { ...state, cache: {} };
      });
  },
});

// Export actions and reducer
export const { setUser, setCache } = usersSlice.actions;
export default usersSlice.reducer;
