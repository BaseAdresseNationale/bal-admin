import PropTypes from 'prop-types'

const SelectInput = ({label, value, hint, options, defaultOption, isDisabled, handleChange}) => (
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
      onChange={event => handleChange(event.target.value)}
    >
      {defaultOption && <option value=''>{defaultOption}</option>}
      {options.map(({label, value, isDisabled}) => (
        <option key={label} value={value} disabled={isDisabled}>{label}</option>
      ))}
    </select>
  </div>

)

SelectInput.defaultProps = {
  hint: null,
  isDisabled: false
}

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  hint: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool
  })).isRequired,
  defaultOption: PropTypes.string,
  isDisabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired
}

export default SelectInput
