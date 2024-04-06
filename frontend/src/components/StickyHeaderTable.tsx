import React, { useEffect } from 'react';
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
import arrowImage from '../assets/images/arrow.png';
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
  // inputs:
  users: User[];
  originalUsers: User[];
  sortField: string;
  sortDirection: string;
  // outputs:
  handleSortFieldChanged: (column: string) => void;
  handleSortDirectionChanged: (sort: 'ASC' | 'DESC') => void;
  handleUserChanged: (userID: number, field: string, value: string) => void;
  handleUserSaved: (user: User) => void;
  handleUserDeleted: (user: User) => void;
}

export const StickyHeaderTable: React.FC<SteakyHeaderProps> = ({
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
  useEffect(() => {
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

  const tableHeaderClicked = (sortField_: string) => {
    const newSortDirection =
      sortField === sortField_
        ? sortDirection === 'ASC'
          ? 'DESC'
          : 'ASC'
        : 'ASC';
    handleSortFieldChanged(sortField_);
    handleSortDirectionChanged(newSortDirection);
  };

  const renderColumn = (
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
        cellContent = (
          <Input
            value={user?.phoneNumber ?? ''}
            label="Phone Number (min 7 characters)"
            helperText="Enter a valid phone number"
            validate={isPhoneNumberValid}
            onChange={(phoneNumber) =>
              handleUserChanged(user.id, 'phoneNumber', phoneNumber)
            }
          />
        );
        break;
      case 'name':
        cellContent = (
          <Input
            value={user?.name ?? ''}
            label="Name"
            helperText="Enter a valid name"
            validate={isNameValid}
            onChange={(name) => handleUserChanged(user.id, 'name', name)}
          />
        );
        break;
      case 'surname':
        cellContent = (
          <Input
            value={user?.surname ?? ''}
            label="Surname"
            helperText="Enter a valid surname"
            validate={isNameValid}
            onChange={(name) => handleUserChanged(user.id, 'surname', name)}
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
            ? { display: 'flex', gap: '1rem', justifyContent: 'space-between' }
            : {}
        }
      >
        {cellContent}
        {isLastColumn && (
          <>
            <Button
              variant="contained"
              disabled={
                !isUserChanged(
                  user,
                  originalUsers.find((user_) => user_?.id === user?.id),
                ) || !isUserValid(user)
              }
              onClick={() => handleUserSaved(user)}
            >
              Save
            </Button>

            <Button variant="contained" onClick={() => handleUserDeleted(user)}>
              Delete
            </Button>
          </>
        )}
      </TableCell>
    );
  };

  return (
    <Paper className="component__table" sx={{ width: '100%' }}>
      <TableContainer>
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
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                  onClick={() => tableHeaderClicked(column.id)}
                >
                  <section className="component__table-header">
                    {column.label}
                    {sortField === column.id && (
                      <img
                        className={'sort-icon ' + sortDirection.toLowerCase()}
                        src={arrowImage}
                        alt=""
                      />
                    )}
                  </section>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user, userIndex) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
