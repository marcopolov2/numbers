import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { countries } from '../constants/Constants';

type Size = 'small' | 'medium';

interface CountrySelectProps {
  disabled?: boolean;
  size?: Size;
  countryCode?: string;
  onChange?: (phoneCode: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  disabled = false,
  size = 'small',
  countryCode = '',
  onChange = (phoneCode: string) => {},
}) => {
  const sortedCountries = useMemo(() => {
    return countries.slice().sort((a, b) => a.label.localeCompare(b.label));
  }, []);
  return (
    <Autocomplete
      disabled={disabled}
      id="country-select-demo"
      sx={{ margin: '0.5rem' }}
      size={size}
      autoHighlight
      value={
        sortedCountries.find((country) => country.phone === countryCode) || null
      }
      options={sortedCountries}
      getOptionLabel={(option) =>
        option.phone ? `+${option.phone} (${option.label})` : ''
      }
      groupBy={(option) => option.label.charAt(0).toUpperCase()}
      renderOption={(props, option) => (
        <Box
          {...props}
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          key={option.code}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          {option.label} (+{option.phone})
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a Country"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password',
          }}
        />
      )}
      onChange={(event, value) => (value ? onChange(value?.phone) : null)}
      filterOptions={(options, { inputValue }) =>
        options.filter(
          (option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.phone.includes(inputValue),
        )
      }
    />
  );
};

export default CountrySelect;
