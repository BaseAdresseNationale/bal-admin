import React, {useEffect, useState} from 'react'
import {SearchBar} from '@codegouvfr/react-dsfr/SearchBar'
import allCommunes from '@etalab/decoupage-administratif/data/communes.json'
import SearchInput from '@/components/search-input'

const allOptions = (allCommunes as CommuneType[])
  .filter(c => ['commune-actuelle', 'arrondissement-municipal'].includes(c.type))
  .map(c => ({label: `${c.nom} (${c.code})`, value: c}))

export type CommuneType = {
  code: string;
  nom: string;
  typeLiaison: number;
  zone: string;
  arrondissement: string;
  departement: string;
  region: string;
  type: string;
  rangChefLieu: number;
  siren: string;
  codesPostaux: string[];
  population: number;
}

type CommuneInputProps = {
  label?: string;
  onChange: (value?: CommuneType) => void;
}

export const CommuneInput = ({label, onChange}: CommuneInputProps) => {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (inputValue.length <= 2) {
      setOptions([])
    } else if (inputValue.length > 2) {
      const newOptions = allOptions.filter(c => c.label.toLowerCase().includes(inputValue.toLowerCase()))
      setOptions(newOptions.slice(0, 10))
    }
  }, [inputValue])

  return (
    <div className='fr-select-group'>
      {label && <label className='fr-label' style={{marginBottom: 8}} htmlFor={`select-${label}`}>
        {label}
      </label>}
      <SearchBar
        renderInput={({className, id, placeholder, type}) => (
          <SearchInput
            options={options}
            className={className}
            id={id}
            placeholder={placeholder}
            type={type}
            onChange={event => {
              onChange(event?.value)
            }}
            onInputChange={newValue => {
              setInputValue(newValue)
            }}
          />
        )}
      />
    </div>

  )
}

