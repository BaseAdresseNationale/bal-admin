import PropTypes from 'prop-types'

const ToggleInput = ({label, isCheck, hint, isDisabled, handleChange}) => (
  <div className='fr-toggle'>
    <input
      type='checkbox'
      className='fr-toggle__input'
      aria-describedby={`toggle-${label}-hint-text`}
      id={`toggle-${label}`}
      value={isCheck}
      checked={isCheck}
      onChange={event => handleChange(event.target.checked)}
      disabled={isDisabled}
    />

    <label
      className='fr-toggle__label'
      htmlFor={`toggle-${label}`}
      data-fr-checked-label='Activé'
      data-fr-unchecked-label='Désactivé'
    >
      {label}
    </label>

    {hint && (
      <p
        className='fr-hint-text'
        id={`toggle-${label}-hint-text`}
      >
        {hint}
      </p>
    )}
  </div>
)

ToggleInput.defaultProps = {
  hint: null,
  isDisabled: false
}

ToggleInput.propTypes = {
  label: PropTypes.string.isRequired,
  isCheck: PropTypes.bool.isRequired,
  hint: PropTypes.string,
  isDisabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired
}

export default ToggleInput
