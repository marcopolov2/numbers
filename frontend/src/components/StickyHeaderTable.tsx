import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Column, User } from '../models/models';
import CountrySelect from './CountrySelect';
import Input from './Input';
import { Button } from '@mui/material';

const columns: readonly Column[] = [
  { id: 'phoneCode', label: 'Phone Code', minWidth: 100 },
  { id: 'phoneNumber', label: 'Phone Number', minWidth: 100 },
  { id: 'firstName', label: 'First Name', minWidth: 100 },
  { id: 'lastName', label: 'Last Name', minWidth: 100 },
];

const createData = (
  id: number,
  phoneCode: string,
  phoneNumber: string,
  name: string,
  surname: string,
): User => {
  return { id, phoneCode, phoneNumber, name, surname };
};

interface SteakyHeaderProps {
  // inputs:
  rows: User[];
  totalRowCount: number;

  // outputs:
  handlePageChanged: (page: number) => void;
  handlePageSizeChanged: (pageSize: number) => void;
  handleRowChanged: (row: User) => void;
}

/**
 * Inputs: rows (users)
 * Outputs:
 *  1. when pagination changed
 *  2. row changed (with updated values)
 */
export const StickyHeaderTable: React.FC<SteakyHeaderProps> = ({
  rows = [],
  totalRowCount = 0,
  handlePageChanged = (page: number) => {},
  handlePageSizeChanged = (pageSize: number) => {},
  handleRowChanged = (row: User) => {},
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    rows.forEach((row) =>
      createData(row.id, row.phoneCode, row.phoneNumber, row.name, row.surname),
    );
  }, [rows]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    handlePageChanged(newPage); //output
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const size = +event.target.value;
    setRowsPerPage(size);
    setPage(0);
    handlePageSizeChanged(size); //output
  };

  const renderColumn = (
    columnId: string,
    user: User,
    isLastColumn: boolean,
  ): JSX.Element | undefined => {
    let cellContent: JSX.Element | undefined;

    switch (columnId) {
      case 'phoneCode':
        cellContent = <CountrySelect countryCode={user.phoneCode} />;
        break;
      case 'phoneNumber':
        cellContent = (
          <Input
            value={user?.phoneNumber ?? ''}
            label="Phone Number (min 7 characters)"
            helperText="Please enter a valid phone number"
          />
        );
        break;
      case 'firstName':
        cellContent = (
          <Input
            value={user?.name ?? ''}
            label="Name"
            helperText="Please enter a valid name"
          />
        );
        break;
      case 'lastName':
        cellContent = (
          <Input
            value={user?.surname ?? ''}
            label="Surname"
            helperText="Please enter a valid surname"
          />
        );
        break;
      default:
        break;
    }

    return (
      <TableCell
        key={columnId}
        sx={isLastColumn ? { display: 'flex', gap: '1rem' } : {}}
      >
        {cellContent}
        {isLastColumn && <Button variant="contained">Save</Button>}
      </TableCell>
    );
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ minHeight: 800 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.phoneCode + row.phoneNumber}
                >
                  {columns.map((column: Column, columnIndex: number) =>
                    renderColumn(
                      column.id,
                      row,
                      columnIndex === columns.length - 1,
                    ),
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalRowCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
