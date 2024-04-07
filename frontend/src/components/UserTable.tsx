import React, { useCallback, useEffect, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CountrySelect from './CountrySelect';
import Input from './Input';
import { Button } from '@mui/material';
import iconArrow from '../assets/images/arrow.png';
import iconDelete from '../assets/images/delete.png';
import {
  isNameValid,
  isPhoneNumberValid,
  isUserValid,
} from '../shared/utility';
import { User } from '../shared/models/models';
import { Column } from '../shared/models/ui';

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

const columns: readonly Column[] = [
  { id: 'phoneCode', label: 'Phone Code', minWidth: 260 },
  { id: 'phoneNumber', label: 'Phone Number', minWidth: 100 },
  { id: 'name', label: 'First Name', minWidth: 100 },
  { id: 'surname', label: 'Last Name', minWidth: 100 },
];

const createData = (
  id: number,
  name: string,
  surname: string,
  phoneCode: string,
  phoneNumber: string,
): User => {
  return { id, phoneCode, phoneNumber, name, surname };
};

interface SteakyHeaderProps {
  users: User[];
  originalUsers: User[];
  sortField: string;
  sortDirection: string;
  handleSortFieldChanged: (column: string) => void;
  handleSortDirectionChanged: (sort: 'ASC' | 'DESC') => void;
  handleUserChanged: (userID: number, field: string, value: string) => void;
  handleUserSaved: (user: User) => void;
  handleUserDeleted: (user: User) => void;
}

export const UserTable: React.FC<SteakyHeaderProps> = ({
  users,
  originalUsers,
  sortField,
  sortDirection,
  handleSortFieldChanged,
  handleSortDirectionChanged,
  handleUserChanged,
  handleUserSaved,
  handleUserDeleted,
}) => {
  const memoizedIsUserChanged = useMemo(() => isUserChanged, []);

  const handleCreateData = useCallback(() => {
    users.forEach((user) =>
      createData(
        user.id,
        user.name,
        user.surname,
        user.phoneCode,
        user.phoneNumber,
      ),
    );
  }, [users]);

  useEffect(() => {
    handleCreateData();
  }, [handleCreateData]);

  const tableHeaderClicked = useCallback(
    (sortField_: string) => {
      const newSortDirection =
        sortField === sortField_
          ? sortDirection === 'ASC'
            ? 'DESC'
            : 'ASC'
          : 'ASC';
      handleSortFieldChanged(sortField_);
      handleSortDirectionChanged(newSortDirection);
    },
    [
      sortField,
      sortDirection,
      handleSortFieldChanged,
      handleSortDirectionChanged,
    ],
  );

  const renderColumn = useCallback(
    (
      columnId: string,
      user: User,
      isLastColumn: boolean,
    ): JSX.Element | undefined => {
      let cellContent: JSX.Element | undefined;

      switch (columnId) {
        case 'phoneCode':
          cellContent = (
            <CountrySelect
              countryCode={user.phoneCode}
              onChange={(code) => handleUserChanged(user.id, 'phoneCode', code)}
            />
          );
          break;
        case 'phoneNumber':
        case 'name':
        case 'surname':
          cellContent = (
            <Input
              value={user[columnId] ?? ''}
              label={
                columnId === 'phoneNumber'
                  ? 'Phone Number (min 7 characters)'
                  : columnId === 'name'
                    ? 'Name'
                    : 'Surname'
              }
              helperText={
                columnId === 'phoneNumber'
                  ? 'Enter a valid phone number'
                  : 'Enter a valid name'
              }
              validate={
                columnId === 'phoneNumber' ? isPhoneNumberValid : isNameValid
              }
              onChange={(value) => handleUserChanged(user.id, columnId, value)}
            />
          );
          break;
        default:
          break;
      }

      return (
        <TableCell
          key={columnId}
          sx={
            isLastColumn
              ? {
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }
              : {}
          }
        >
          {cellContent}
          {isLastColumn && (
            <section className="action-buttons u-row">
              <Button
                variant="contained"
                disabled={
                  !memoizedIsUserChanged(
                    user,
                    originalUsers.find((user_) => user_?.id === user?.id),
                  ) || !isUserValid(user)
                }
                onClick={() => handleUserSaved(user)}
              >
                Save
              </Button>

              <img
                className="icon-delete"
                src={iconDelete}
                alt=""
                onClick={() => handleUserDeleted(user)}
              />
            </section>
          )}
        </TableCell>
      );
    },
    [
      memoizedIsUserChanged,
      handleUserChanged,
      handleUserSaved,
      handleUserDeleted,
      originalUsers,
    ],
  );

  return (
    <TableContainer
      component={Paper}
      className="component__usertable"
      sx={{ width: '100%', opacity: 0.9 }}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow
            sx={{
              '& th': {
                backgroundColor: '#1976d2',
                color: 'white',
              },
            }}
          >
            {columns.map((column: Column) => (
              <TableCell
                sx={{
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                key={column.id}
                style={{ minWidth: column.minWidth }}
                onClick={() => tableHeaderClicked(column.id)}
              >
                <section className="u-row component__usertable-header">
                  {column.label}
                  {sortField === column.id && (
                    <img
                      className={'icon-sort ' + sortDirection.toLowerCase()}
                      src={iconArrow}
                      alt=""
                    />
                  )}
                </section>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {users.length === 0 ? (
            <TableRow hover role="checkbox" sx={{ width: '100%' }}>
              <TableCell>
                <div>No Users...</div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, userIndex) => (
              <TableRow
                hover
                role="checkbox"
                key={userIndex}
                sx={{
                  backgroundColor:
                    userIndex % 2 !== 0 ? '#bebebe57' : '#ffffff80',
                }}
              >
                {columns.map((column: Column, columnIndex: number) =>
                  renderColumn(
                    column.id,
                    user,
                    columnIndex === columns.length - 1,
                  ),
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
