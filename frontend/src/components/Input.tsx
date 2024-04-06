import React, { useState, ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';

interface InputProps {
  disabled?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  value?: string;
  label?: string;
  helperText?: string;
  validate?: (value: string) => boolean;
  onChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  disabled = false,
  variant = 'outlined',
  size = 'small',
  value = '',
  label = 'Input',
  helperText = '',
  validate = () => true,
  onChange = () => {},
}) => {
  const [error, setError] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;
    const isValid = validate(newValue);

    setError(!isValid);
    onChange(newValue);
  };

  return (
    <TextField
      disabled={disabled}
      sx={{ margin: '0.5rem' }}
      autoFocus
      variant={variant}
      label={label}
      value={value}
      error={error}
      helperText={error ? helperText : ''}
      size={size}
      onChange={handleChange}
    />
  );
};

export default Input;
