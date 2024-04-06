import { APIS } from '../constants/Constants';
import {
  ADDUSER_ARGS,
  ApiError,
  DELETEUSER_ARGS,
  GETUSERS_ARGS,
  Users,
} from '../shared/models/api';
import { User } from '../shared/models/models';

export const GETUSERS = async (
  args: GETUSERS_ARGS,
  signal?: AbortSignal,
): Promise<Users | ApiError> => {
  try {
    const url = `${APIS.LOCAL}${APIS.API_BASE}/v2?search=${args.search}&field=${args.sortField}&direction=${args.sortDirection}&size=${args.pageSize}&page=${args.page}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data: Users = await response.json();
    return data;
  } catch (error: any) {
    const fetchError: ApiError = {
      message: error?.message ?? 'Unknown error',
      status: error?.status ?? '',
    };
    return fetchError;
  }
};

export const ADDUSER = async (
  args: ADDUSER_ARGS,
  signal?: AbortSignal,
): Promise<User | ApiError> => {
  try {
    const url = `${APIS.LOCAL}${APIS.API_BASE}?name=${args.name}&surname=${args.surname}&phoneCode=${args.phoneCode}&phoneNumber=${args.phoneNumber}`;
    const body = JSON.stringify({
      name: args.name,
      surname: args.surname,
      phoneCode: args.phoneCode,
      phoneNumber: args.phoneNumber,
    });

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to add users');
    }

    const data: User = await response.json();
    return data;
  } catch (error: any) {
    const fetchError: ApiError = {
      message: error?.message ?? 'Unknown error',
      status: error?.status ?? '',
    };
    return fetchError;
  }
};

export const UPDATEUSER = async (
  args: User,
  signal?: AbortSignal,
): Promise<User | ApiError> => {
  try {
    const url = `${APIS.LOCAL}${APIS.API_BASE}/${args.id}`;

    const body = JSON.stringify({
      name: args.name,
      surname: args.surname,
      phoneCode: args.phoneCode,
      phoneNumber: args.phoneNumber,
    });

    const response = await fetch(url, {
      method: 'PUT',
      body,
      headers: { 'Content-Type': 'application/json' },
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to update users');
    }
    const data = await response.json();

    return data;
  } catch (error: any) {
    const fetchError: ApiError = {
      message: error?.message ?? 'Unknown error',
      status: error?.status ?? '',
    };
    return fetchError;
  }
};

export const DELETEUSER = async (
  args: DELETEUSER_ARGS,
  signal?: AbortSignal,
): Promise<string | ApiError> => {
  try {
    const url = `${APIS.LOCAL}${APIS.API_BASE}/${args.userID}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      signal,
    });

    if (!response.ok) {
      throw new Error('Failed to delete users');
    }
    const data = await response.text();

    return data;
  } catch (error: any) {
    const fetchError: ApiError = {
      message: error?.message ?? 'Unknown error',
      status: error?.status ?? '',
    };
    return fetchError;
  }
};
