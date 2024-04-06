import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUsers,
  addUser,
  setUser,
  deleteUser,
  updateUser,
} from '../store/usersSlice';
import Input from '../components/Input';
import {
  selectAllOriginalUsers,
  selectAllUsers,
  selectCacheState,
} from '../store/userSelectors';
import { StickyHeaderTable } from '../components/StickyHeaderTable';
import { User } from '../shared/models/models';
import { RootState } from '../store/store';
import { Button } from '@mui/material';
import AddUserPopup from '../components/AddUserPopup';

const intialFilters = {
  search: '',
  page: 0,
  pageSize: 10,
  sortField: 'phoneCode',
  sortDirection: 'ASC',
};

const Home: React.FC = () => {
  // local:
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState<string>(intialFilters.search);
  const [page, setPage] = useState<number>(intialFilters.page);
  const [pageSize, setPageSize] = useState<number>(intialFilters.pageSize);
  const [sortField, setSortField] = useState<string>(intialFilters.sortField);
  const [sortDirection, setSortDirection] = useState<string>(
    intialFilters.sortDirection,
  );

  // redux:
  const dispatch = useDispatch();
  const users: User[] = useSelector(selectAllUsers);
  const cache = useSelector(selectCacheState);
  const originalUsers: User[] = useSelector(selectAllOriginalUsers);
  const totalUsers = useSelector((state: RootState) => state.users.totalUsers);

  const handleFetchUsers = useCallback(() => {
    const debounceTimeout = setTimeout(() => {
      dispatch(
        getUsers({
          search,
          sortField,
          sortDirection,
          pageSize,
          page: page + 1,
        }) as any,
      );
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [dispatch, search, sortField, sortDirection, pageSize, page]);

  useEffect(() => {
    const cacheReset = Object.keys(cache).length === 0;

    if (cacheReset) {
      handleFetchUsers();
    }
  }, [handleFetchUsers, cache]);

  useEffect(() => {
    handleFetchUsers();
  }, [
    handleFetchUsers,
    dispatch,
    search,
    sortField,
    sortDirection,
    pageSize,
    page,
  ]);

  const handleUserDeleted = (user: User) => {
    dispatch(deleteUser({ userID: user.id }) as any);
  };

  return (
    <section className="page__home">
      {/* <pre>{JSON.stringify(cache, null, 2)}</pre> */}
      <AddUserPopup
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={(user) => dispatch(addUser(user) as any)}
      />
      <section className="row search">
        <h1>Search:</h1>
        <Input
          value={search}
          label="Search any field"
          onChange={(search) => setSearch(search)}
        />
      </section>

      <Button
        style={{
          width: '15.625rem',
          marginLeft: 'auto',
          marginRight: 0,
          marginBottom: '1rem',
        }}
        variant="contained"
        onClick={() => setOpenModal(true)}
      >
        + Add User
      </Button>

      <StickyHeaderTable
        users={users}
        originalUsers={originalUsers}
        totalUsersCount={totalUsers}
        page={page}
        pageSize={pageSize}
        sortField={sortField}
        sortDirection={sortDirection}
        handlePageChanged={setPage}
        handlePageSizeChanged={setPageSize}
        handleUserSaved={(user) => dispatch(updateUser(user) as any)}
        handleUserDeleted={handleUserDeleted}
        handleSortFieldChanged={setSortField}
        handleSortDirectionChanged={setSortDirection}
        handleUserChanged={(userId, field, value) =>
          dispatch(setUser({ userId, field, value }))
        }
      ></StickyHeaderTable>
    </section>
  );
};

export default Home;
