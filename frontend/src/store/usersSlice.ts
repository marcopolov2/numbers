import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchUsersData } from './api'; // Import your API function
import { APIArgs, User, UsersState } from '../models/models';

// Define initial state
const initialState: UsersState = {
  ids: [],
  entities: { users: {} },
  totalUsers: 0, // Add totalUsers field to initial state
  status: 'idle',
  error: null,
};

// Create async thunk for fetching users data
export const fetchUsers = createAsyncThunk<
  { users: User[]; totalUsers: number },
  APIArgs
>('users/fetchUsers', async (args, thunkAPI) => {
  try {
    const response = await fetchUsersData(args);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    const users = data?._embedded?.employeeList as User[];

    // Calculate the total number of users based on the last page URL
    let totalUsers = 0;
    const lastPageUrl = data?._links?.last?.href;
    if (lastPageUrl) {
      const urlParams = new URLSearchParams(lastPageUrl);
      const lastPage = +(urlParams?.get('page') ?? 0);
      const pageSize = args.size;
      totalUsers = pageSize * lastPage;
    }

    return { users, totalUsers };
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

// Create users slice
export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.entities.users = {}; // Clear existing users
      state.ids = []; // Clear existing IDs
      action.payload.forEach((user) => {
        state.entities.users[user.id] = user;
        state.ids.push(user.id);
      });
    },
    updateUserField: (
      state,
      action: PayloadAction<{ userId: string; field: string; value: string }>,
    ) => {
      const { userId, field, value } = action.payload;
      if ((state.entities.users as any)?.[userId]?.[field]) {
        (state.entities.users as any)[userId][field] = value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.entities.users = {};
        state.ids = [];
        action.payload.users.forEach((user) => {
          state.entities.users[user.id] = user;
          state.ids.push(user.id);
        });
        state.totalUsers = action.payload.totalUsers; // Set totalUsers
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

// Export actions and reducer
export const { setUsers, updateUserField } = usersSlice.actions;
export default usersSlice.reducer;
