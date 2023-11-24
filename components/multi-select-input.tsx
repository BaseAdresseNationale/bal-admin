import React, {useState} from 'react'
import styled from 'styled-components'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

type SelectOptionType<T> = {
  label: string;
  value: T;
}

type MultiSelectInputProps<T> = {
  label: string;
  placeholder?: string;
  options: Array<SelectOptionType<T>>;
  onChange: (value: T[]) => void;
  value?: T[];
  hint?: string;
  isDisabled?: boolean;
}

const StyledAutocomplete = styled(Autocomplete)`
    background-color: var(--background-contrast-grey);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    .MuiInputBase-root {
        > input.MuiInputBase-input {
        padding: 0.5rem 1rem;
        }
    }
`

export const MultiSelectInput = <T extends unknown>({label, placeholder, options, onChange, value, hint, isDisabled}: MultiSelectInputProps<T>) => {
  const [searchValue, setSearchValue] = useState('')

  const getOptions = () => {
    if (searchValue) {
      return options.filter(option => option.label.toLowerCase().includes(searchValue.toLowerCase()))
    }

    return options
  }

  const getValues = () => {
    if (value) {
      return options.filter(option => value.includes(option.value))
    }

    return []
  }

  return (
    <div className={`fr-select-group ${isDisabled ? 'fr-select-group--disabled' : ''}`}>
      <label className='fr-label' htmlFor={`select-${label}`}>
        {label}
        {hint && <span className='fr-hint-text'>{hint}</span>}
      </label>
      <StyledAutocomplete
        multiple
        value={getValues()}
        style={{width: '100%'}}
        options={getOptions()}
        getOptionLabel={option => option.label}
        onChange={(event, values) => {
          onChange(values.map(({value}) => value))
        }}
        renderInput={params => (
          <TextField
            {...params}
            variant='standard'
            placeholder={placeholder}
          />
        )}
      />
    </div>

  )
}

