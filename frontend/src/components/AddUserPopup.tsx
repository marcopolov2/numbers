import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { User } from '../shared/models/models';
import {
  isNameValid,
  isPhoneNumberValid,
  isUserValid,
} from '../shared/utility';
import Input from './Input';
import CountrySelect from './CountrySelect';

interface AddUserProps {
  open: boolean;
  onAdd: (user: User) => void;
  onClose: () => void;
}

const AddUserPopup: React.FC<AddUserProps> = ({ open, onClose, onAdd }) => {
  const [user, setUser] = useState<User>({
    id: -1,
    name: '',
    surname: '',
    phoneCode: '',
    phoneNumber: '',
  });

  const setField = (field: string, value: string): void => {
    if (field in user) {
      setUser((prev: User) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAddUser = () => {
    onAdd(user);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ margin: 'auto' }}>
      <DialogTitle>Enter User Details</DialogTitle>
      <DialogContent
        sx={{
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
          height: 'auto',
        }}
      >
        <CountrySelect
          countryCode={user.phoneCode}
          onChange={(code) => setField('phoneCode', code)}
        />

        <Input
          label="Name"
          validate={isNameValid}
          value={user.name}
          onChange={(value) => setField('name', value)}
        />
        <Input
          label="Surname"
          validate={isNameValid}
          value={user.surname}
          onChange={(value) => setField('surname', value)}
        />
        <Input
          value={user?.phoneNumber ?? ''}
          label="Phone Number (min 7 characters)"
          helperText="Enter a valid phone number"
          validate={isPhoneNumberValid}
          onChange={(value) => setField('phoneNumber', value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!isUserValid(user, true)} onClick={handleAddUser}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserPopup;
