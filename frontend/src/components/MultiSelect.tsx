import { Autocomplete, TextField } from '@mui/material'

const options = [
  { title: 'Phone Code' },
  { title: 'Phone Number' },
  { title: 'Name' },
  { title: 'Surname' },
]

export const MultiSelect = () => {
  return (
    <Autocomplete
      multiple
      fullWidth={true}
      id="tags-outlined"
      size="small"
      options={options}
      getOptionLabel={(option) => option.title}
      defaultValue={[]}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Search Options"
          placeholder="Search Filters"
        />
      )}
    />
  )
}
