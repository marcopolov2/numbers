import { createSelector, Selector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { UsersState } from '../shared/models/redux';
import { User } from '../shared/models/models';

/**
 * GETTERS
 *
 */

// Define the type for the selectUsersState selector
const selectUsersState: Selector<RootState, UsersState | undefined> = (
  state,
): UsersState => state.users;

type CacheState = Record<string, any>;

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

// Define the type for the selectAllUsers selector
export const selectAllOriginalUsers: Selector<RootState, User[]> =
  createSelector(selectUsersState, (usersState) => {
    // Extracting users from the entities object
    const userRecords = usersState?.entities?.originalUsers ?? [];

    // Map user IDs to User objects
    const users = usersState?.ids?.map((id: number) => userRecords?.[id]) ?? [];
    return users;
  });

export const selectCacheState: Selector<RootState, CacheState> = (
  state: RootState,
): CacheState => state.users.cache;
