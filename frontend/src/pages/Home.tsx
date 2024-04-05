import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserField } from '../store/usersSlice';
import { Button } from '@mui/material';
import Input from '../components/Input';
import CountrySelect from '../components/CountrySelect';
import { selectAllUsers } from '../store/userSelectors';
import { MultiSelect } from '../components/MultiSelect';
import { StickyHeaderTable } from '../components/StickyHeaderTable';
import { User } from '../models/models';
import { RootState } from '../store/store';

const initialFilters: { [key: string]: string } = {
  phoneCode: '',
  phoneNumber: '',
  name: '',
  surname: '',
};

const filterLabels: { [key: string]: string } = {
  phoneCode: 'Phone Code',
  phoneNumber: 'Phone Number',
  name: 'Names',
  surname: 'Surnames',
};

const validatePhoneNumber = (phoneNumber: string): boolean =>
  !!(phoneNumber && phoneNumber.length >= 7 && /^\d+$/.test(phoneNumber));
const validateName = (value: string): boolean => !!value;
const validateUser = (user: User): boolean =>
  validateName(user.name) &&
  validateName(user.surname) &&
  validatePhoneNumber(user.phoneNumber);

const isUserChanged = (user: User, newUser: User | undefined): boolean => {
  if (!newUser) {
    return true;
  }

  for (const key in user) {
    if (Object.prototype.hasOwnProperty.call(user, key)) {
      const userValue = (user as any)?.[key];
      const newUserValue = (newUser as any)?.[key];

      if (userValue !== newUserValue) {
        return true;
      }
    }
  }

  for (const key in newUser) {
    if (!(key in user)) {
      return true;
    }
  }

  return false;
};

const Home: React.FC = () => {
  // local variables for endpoints:
  const [search, setSearch] = useState<string>('');
  const [field, setField] = useState<string>('name');
  const [direction, setDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  // end: local variables for endpoints:

  const dispatch = useDispatch();
  const users: User[] = useSelector(selectAllUsers);
  const totalUsers = useSelector((state: RootState) => state.users.totalUsers);

  const initialUsers: User[] = useSelector(selectAllUsers);
  const status = useSelector((state: RootState) => state.users.status);
  const error = useSelector((state: RootState) => state.users.error);
  const [filters, setFilters] = useState<{ [key: string]: string }>(
    initialFilters,
  );

  useEffect(() => {
    dispatch(fetchUsers({ search, field, direction, size, page }) as any);
  }, [dispatch, search, field, direction, size, page]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        user.surname.toLowerCase().includes(filters.surname.toLowerCase()) &&
        user.phoneCode.includes(filters.phoneCode) &&
        user.phoneNumber.includes(filters.phoneNumber),
    );
  }, [users, filters]);

  const handleFilterChange = useCallback((key: string, newValue: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: newValue }));
  }, []);

  const handleFieldChange = (
    userID: string,
    field: string,
    fieldValue: string,
  ) => {
    dispatch(
      updateUserField({ userId: userID, field: field, value: fieldValue }),
    );
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const handleSave = (user: User) => {
    // Logic to save the modified user data
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  // table callbacks
  const handlePageChanged = (page: number) => {
    console.log(page);
  };

  const handlePageSizeChanged = (pageSize: number) => {
    console.log(pageSize);
  };

  const handleRowChanged = (row: User) => {
    console.log(row);
  };

  return (
    <StickyHeaderTable
      rows={users}
      totalRowCount={totalUsers}
      handlePageChanged={(page) => handlePageChanged(page)}
      handlePageSizeChanged={(pageSize) => handlePageSizeChanged(pageSize)}
      handleRowChanged={(row) => handleRowChanged(row)}
    ></StickyHeaderTable>
  );

  // return (
  //     <>
  //         <pre>{JSON.stringify(users, null, 2)}</pre>
  //         <section className='container row'>
  //             Filters:
  //             {
  //                 Object.entries(filters).map(([key, value]) => (
  //                     <Input
  //                         key={key}
  //                         value={value}
  //                         onChange={(newValue) => handleFilterChange(key, newValue)}
  //                         label={filterLabels[key]}
  //                     />
  //                 ))
  //             }

  //             <Input
  //                 value={search}
  //                 label="search"
  //             />

  //             <MultiSelect />

  //         </section>
  //         <Button variant="contained" onClick={clearFilters} >Clear All Filters</Button>
  //         <section className='container'>
  //             {filteredUsers.map((user) => (
  //                 <div key={user.id} className='row'>
  //                     <CountrySelect onChange={(countryCode) => handleFieldChange(user.id, 'phoneCode', countryCode)} countryCode={user.phoneCode}></CountrySelect>
  //                     <Input
  //                         value={user?.phoneNumber ?? ''}
  //                         validate={validatePhoneNumber}
  //                         onChange={(phoneNumber) => handleFieldChange(user.id, 'phoneNumber', phoneNumber)}
  //                         label="Phone Number (min 7 characters)"
  //                         helperText="Please enter a valid phone number"/>

  //                     <Input
  //                         value={user?.name ?? ''}
  //                         validate={validateName}
  //                         onChange={(name) => handleFieldChange(user.id, 'name', name)}
  //                         label="Name"
  //                         helperText="Please enter a valid name" />

  //                     <Input
  //                         value={user?.surname ?? ''}
  //                         validate={validateName}
  //                         onChange={(surname) => handleFieldChange(user.id, 'surname', surname)}
  //                         label="Surname"
  //                         helperText="Please enter a valid surname"
  //                    />
  //                     <Button
  //                         variant="contained"
  //                         onClick={() => handleSave(user)}
  //                         disabled={!isUserChanged(user, initialUsers.find((user_) => user.id === user_.id)) || !validateUser(user)}>
  //                         Save
  //                     </Button>
  //                 </div >
  //             ))}
  //         </section >
  //     </>
  // );
};

export default Home;
