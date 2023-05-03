import PropTypes from 'prop-types'

const TextInput = ({label, value, hint, isDisabled, onChange}) => (
  <div className={`fr-input-group ${isDisabled ? 'fr-select-input--disabled' : ''}`}>
    <label className='fr-label' htmlFor={`input-${label}`}>
      {label}
      {hint && <span className='fr-hint-text'>{hint}</span>}
    </label>

    <input
      className='fr-input'
      id={`input-${label}`}
      name={`input-${label}`}
      value={value}
      disabled={isDisabled}
      onChange={event => onChange(event)}
    />
  </div>

)

TextInput.defaultProps = {
  value: '',
  hint: null,
  isDisabled: false
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  hint: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

export default TextInput
