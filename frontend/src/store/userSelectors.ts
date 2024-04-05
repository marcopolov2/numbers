import { createSelector, Selector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { User, UsersState } from '../models/models';

// Define the type for the selectUsersState selector
const selectUsersState: Selector<RootState, UsersState | undefined> = (
  state,
): UsersState => state.users;

// Define the type for the selectAllUsers selector
export const selectAllUsers: Selector<RootState, User[]> = createSelector(
  selectUsersState,
  (usersState) => {
    // Extracting users from the entities object
    const userRecords = usersState?.entities?.users ?? [];

    // Map user IDs to User objects
    const users = usersState?.ids?.map((id: number) => userRecords?.[id]) ?? [];

    return users;
  },
);
