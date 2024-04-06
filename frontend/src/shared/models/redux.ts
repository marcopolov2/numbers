import { User } from './models';

export interface UsersState {
  entities: {
    users: Record<number, User>;
    originalUsers: Record<number, User>;
  };
  totalUsers: number;
  ids: number[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  cache: Record<string, any>;
}
