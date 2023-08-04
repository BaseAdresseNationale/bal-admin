type SelectInputProps = {
  label: string;
  value?: string | string[];
  hint?: string;
  options: Array<{
    label: string;
    value: string;
    isDisabled?: boolean;
  }>;
  defaultOption?: string;
  isDisabled?: boolean;
  handleChange: (value: string | string[]) => void;
  isMultiple?: boolean;
}

const SelectInput = ({label, value, hint, options, defaultOption, isDisabled, handleChange, isMultiple}: SelectInputProps) => (
  <div className={`fr-select-group ${isDisabled ? 'fr-select-group--disabled' : ''}`}>
    <label className='fr-label' htmlFor={`select-${label}`}>
      {label}
      {hint && <span className='fr-hint-text'>{hint}</span>}
    </label>

    <select
      className='fr-select'
      id={`select-${label}`}
      name={`select-${label}`}
      value={value}
      disabled={isDisabled}
      onChange={event => {
        handleChange(event.target.value)
      }}
      multiple={isMultiple}
    >
      {defaultOption && <option value=''>{defaultOption}</option>}
      {options.map(option => (
        <option
          key={option.label}
          value={option.value}
          disabled={isDisabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>

)

export default SelectInput
