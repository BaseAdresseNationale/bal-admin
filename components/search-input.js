import PropTypes from 'prop-types'
import Autocomplete from '@mui/material/Autocomplete'
import {cx} from '@codegouvfr/react-dsfr/tools/cx'

const SearchInput = ({id, className, placeholder, type, options, onChange, onInputChange}) => (
  <Autocomplete
    id={id}
    style={{width: '100%'}}
    options={options}
    onChange={(event, newValue) => onChange(newValue)}
    onInputChange={(event, newInputValue) => onInputChange(newInputValue)}
    renderInput={params => (
      <div ref={params.InputProps.ref}>
        <input
          {...params.inputProps}
          className={cx(params.inputProps.className, className)}
          placeholder={placeholder}
          type={type}
        />
      </div>
    )}
  />
)

SearchInput.defaultProps = {
  className: '',
  placeholder: '',
}

SearchInput.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired
}

export default SearchInput
