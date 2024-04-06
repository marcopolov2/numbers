import { User } from './models';

export interface GETUSERS_ARGS {
  search: string;
  sortField: string;
  sortDirection: string;
  page: number;
  pageSize: number;
}

export interface DELETEUSER_ARGS {
  userID: number;
}

export interface ADDUSER_ARGS {
  name: string;
  surname: string;
  phoneCode: string;
  phoneNumber: string;
}

export interface Link {
  href: string;
}
export interface Users {
  _embedded: { employeeList: User[] };
  _links: { last: Link; next: Link; prev: Link; self: Link; totalUsers: Link };
}

export interface ApiError {
  message: string;
  status?: number;
}
