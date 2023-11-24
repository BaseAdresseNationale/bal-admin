import React from 'react'

type TimeInputProps = {
  label: string;
  onChange: (value: string) => void;
  value?: string[];
}

export const DateInput = ({label, onChange, value }: TimeInputProps) => {

  return (
    <div>
      <label className='fr-label' htmlFor={`select-${label}`}>
        {label}
      </label>
      <input type="time" value={value} onChange={event => onChange(event.target.value)} />
    </div>
  )
}

