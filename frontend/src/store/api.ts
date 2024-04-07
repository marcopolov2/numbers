import { APIS } from '../constants/Constants';
import {
  ADDUSER_ARGS,
  ApiError,
  DELETEUSER_ARGS,
  GETUSERS_ARGS,
  Users,
} from '../shared/models/api';
import { User } from '../shared/models/models';

const commonHeaders = { 'Content-Type': 'application/json' };

type FetchFunction<T> = (
  url: string,
  options: RequestInit,
  responseType: 'string' | 'json',
  signal?: AbortSignal,
) => Promise<T | ApiError>;

const fetchApi: FetchFunction<any> = async (
  url,
  options,
  responseType,
  signal,
) => {
  try {
    const response = await fetch(url, { ...options, signal });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    let data: any;
    if (responseType === 'json') {
      data = await response.json();
    } else {
      data = await response.text();
    }
    return data;
  } catch (error: any) {
    const fetchError: ApiError = {
      message: error?.message ?? 'Unknown error',
      status: error?.status ?? '',
    };
    return fetchError;
  }
};

export const GETUSERS = async (
  args: GETUSERS_ARGS,
  signal?: AbortSignal,
): Promise<Users | ApiError> => {
  const url = `${APIS.LOCAL}${APIS.API_BASE}/v2?search=${args.search.trim()}&field=${args.sortField}&direction=${args.sortDirection}&size=${args.pageSize}&page=${args.page}`;
  return fetchApi(url, {}, 'json', signal);
};

export const ADDUSER = async (
  args: ADDUSER_ARGS,
  signal?: AbortSignal,
): Promise<User | ApiError> => {
  const url = `${APIS.LOCAL}${APIS.API_BASE}`;
  const body = JSON.stringify({
    name: args.name,
    surname: args.surname,
    phoneCode: args.phoneCode,
    phoneNumber: args.phoneNumber,
  });

  return fetchApi(
    url,
    { method: 'POST', body, headers: commonHeaders },
    'json',
    signal,
  );
};

export const UPDATEUSER = async (
  args: User,
  signal?: AbortSignal,
): Promise<User | ApiError> => {
  const url = `${APIS.LOCAL}${APIS.API_BASE}/${args.id}`;

  const body = JSON.stringify({
    name: args.name,
    surname: args.surname,
    phoneCode: args.phoneCode,
    phoneNumber: args.phoneNumber,
  });

  return fetchApi(
    url,
    { method: 'PUT', body, headers: commonHeaders },
    'json',
    signal,
  );
};

export const DELETEUSER = async (
  args: DELETEUSER_ARGS,
  signal?: AbortSignal,
): Promise<string | ApiError> => {
  const url = `${APIS.LOCAL}${APIS.API_BASE}/${args.userID}`;
  return fetchApi(
    url,
    { method: 'DELETE', headers: commonHeaders, signal },
    'string',
    signal,
  );
};
