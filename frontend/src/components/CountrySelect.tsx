import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { countries } from '../constants/Constants'

// Define a type for the size prop
type Size = 'small' | 'medium'

interface CountrySelectProps {
  size?: Size // Define the size prop with the Size type
  countryCode?: string
  onChange?: (phoneCode: string) => void
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  size = 'small',
  countryCode = '',
  onChange = (phoneCode: string) => {},
}) => {
  const sortedCountries = countries.sort((a, b) =>
    a.label.localeCompare(b.label),
  )

  return (
    <Autocomplete
      id="country-select-demo"
      fullWidth={true}
      size={size}
      autoHighlight
      value={
        sortedCountries.find((country) => country.phone === countryCode) || null
      }
      options={sortedCountries}
      getOptionLabel={(option) => `+${option.phone}`}
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
      filterOptions={(options, { inputValue }) => {
        return options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase()),
        )
      }}
    />
  )
}

export default CountrySelect
