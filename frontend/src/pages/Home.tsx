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
import { Button, TablePagination } from '@mui/material';
import AddUserPopup from '../components/AddUserPopup';

const intialFilters = {
  search: '',
  page: 0,
  pageSize: 10,
  sortField: 'phoneCode',
  sortDirection: 'ASC',
};

const PAGE_SIZES = [5, 10, 25, 100];

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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const size = +event.target.value;
    setPage(0);
    setPageSize(size);
  };

  return (
    <section className="page__home">
      <AddUserPopup
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={(user) => dispatch(addUser(user) as any)}
      />

      <section className="container__logo">
        <div className="earth">
          <div></div>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="motion-blur-filter" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="100 0"></feGaussianBlur>
          </filter>
        </svg>
        <span filter-content="S">Express Phonebook</span>
      </section>

      <section className="container__search">
        <h1>Search:</h1>
        <Input
          value={search}
          label="Search any field"
          onChange={(search) => setSearch(search)}
        />

        <Button variant="contained" onClick={() => setOpenModal(true)}>
          + Add
        </Button>
      </section>

      <section className="container__table">
        <StickyHeaderTable
          users={users}
          originalUsers={originalUsers}
          sortField={sortField}
          sortDirection={sortDirection}
          handleUserSaved={(user) => dispatch(updateUser(user) as any)}
          handleUserDeleted={(user) =>
            dispatch(deleteUser({ userID: user.id }) as any)
          }
          handleSortFieldChanged={setSortField}
          handleSortDirectionChanged={setSortDirection}
          handleUserChanged={(userId, field, value) =>
            dispatch(setUser({ userId, field, value }))
          }
        />
      </section>

      <TablePagination
        rowsPerPageOptions={PAGE_SIZES}
        component="div"
        count={totalUsers}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={(_, page) => setPage(page)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </section>
  );
};

export default Home;
