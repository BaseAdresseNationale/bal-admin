import React from 'react'

type DateInputProps = {
  label: string;
  onChange: (value: string) => void;
  value?: string[];
}

export const DateInput = ({label, onChange, value }: DateInputProps) => {

  return (
    <div>
      <label className='fr-label' htmlFor={`select-${label}`}>
        {label}
      </label>
      <input type="date" value={value} onChange={event => onChange(event.target.value)} />
    </div>
  )
}

