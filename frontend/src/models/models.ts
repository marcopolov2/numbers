export interface APIArgs {
  search: string;
  field: string;
  direction: 'ASC' | 'DESC';
  size: number;
  page: number;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  phoneCode: string;
  phoneNumber: string;
}

// redux
export interface UsersState {
  entities: {
    users: Record<number, User>;
  };
  totalUsers: number;
  ids: number[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// ui
export interface Column {
  id: 'phoneCode' | 'phoneNumber' | 'firstName' | 'lastName';
  label: string;
  minWidth?: number;
}
