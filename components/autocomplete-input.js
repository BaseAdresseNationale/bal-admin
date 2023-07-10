import PropTypes from 'prop-types'

const AutocompleteInput = ({id, label, value, hint, options, isDisabled, onChange, placeholder, onSelect}) => (
  <div className={`${onSelect ? 'fr-search-bar' : 'fr-input-group'} ${isDisabled ? 'fr-select-input--disabled' : ''}`}>
    <label className='fr-label' htmlFor={`input-${label}`}>
      {label}
      {hint && <span className='fr-hint-text'>{hint}</span>}
    </label>

    <input
      className='fr-input'
      list={'browsers#' + id}
      id={`input-${label}`}
      name={`input-${label}`}
      value={value}
      disabled={isDisabled}
      placeholder={placeholder}
      onChange={event => onChange(event)}
    />
    {onSelect && <button className='fr-btn' type='button' title='Rechercher' onClick={event => onSelect(event)}>Rechercher</button>}
    <datalist id={'browsers#' + id}>
      {options.map(option => (
        <option
          key={option.label}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </datalist>
  </div>
)

AutocompleteInput.defaultProps = {
  value: '',
  hint: null,
  isDisabled: false,
  placeholder: '',
  onSelect: null,
}

AutocompleteInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  hint: PropTypes.string,
  options: PropTypes.array.isRequired,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
}

export default AutocompleteInput
