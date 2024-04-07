import { createSelector, Selector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { UsersState } from '../shared/models/redux';
import { User } from '../shared/models/models';

/**
 * GETTERS
 *
 */

const selectUsersState: Selector<RootState, UsersState | undefined> = (
  state,
): UsersState => state.users;

type CacheState = Record<string, any>;

export const selectAllUsers: Selector<RootState, User[]> = createSelector(
  selectUsersState,
  (usersState) => {
    const userRecords = usersState?.entities?.users ?? [];
    const users = usersState?.ids?.map((id: number) => userRecords?.[id]) ?? [];
    return users;
  },
);

export const selectAllOriginalUsers: Selector<RootState, User[]> =
  createSelector(selectUsersState, (usersState) => {
    const userRecords = usersState?.entities?.originalUsers ?? [];
    const users = usersState?.ids?.map((id: number) => userRecords?.[id]) ?? [];
    return users;
  });

export const selectCacheState: Selector<RootState, CacheState> = (
  state: RootState,
): CacheState => state.users.cache;
