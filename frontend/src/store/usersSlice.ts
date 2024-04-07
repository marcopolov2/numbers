import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersState } from '../shared/models/redux';
import { addUser, deleteUser, getUsers, updateUser } from './asyncThunks';

const initialState: UsersState = {
  ids: [],
  entities: { users: {}, originalUsers: {} },
  totalUsers: 0,
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

export const { setUser, setCache } = usersSlice.actions;
export default usersSlice.reducer;
