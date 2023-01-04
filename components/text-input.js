import PropTypes from 'prop-types'

const TextInput = ({label, value, hint, isDisabled, error, handleChange}) => (
  <div className={`fr-input-group ${isDisabled ? 'fr-input-group--disabled' : ''} ${error ? 'fr-input-group--error' : ''}`}>
    <label className='fr-label' htmlFor={`text-input-${label}`}>{label}
      {hint && <span className='fr-hint-text'>{hint}</span>}
    </label>

    <input
      className={`fr-input ${error ? 'fr-input-group--error' : ''}`}
      type='text'
      id={`text-input-${label}`}
      name={`text-input-${label}`}
      value={value}
      disabled={isDisabled}
      onChange={e => handleChange(e.target.value)}
    />

    {error && (
      <p id='text-input-error-desc-error' className='fr-error-text'>
        {error}
      </p>
    )}
  </div>
)

TextInput.defaultProps = {
  hint: null,
  isDisabled: false,
  error: null,
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  hint: PropTypes.string,
  isDisabled: PropTypes.bool,
  error: PropTypes.string,
  handleChange: PropTypes.func.isRequired
}

export default TextInput
