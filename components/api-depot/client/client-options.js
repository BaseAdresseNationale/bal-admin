import PropTypes from 'prop-types'

import ToggleSwitch from '@codegouvfr/react-dsfr/ToggleSwitch'

const ClientOptions = ({isModeRelax, isDisabled, onUpdate}) => (
  <div className='fr-container fr-py-12v'>
    <h2>Options</h2>
    <div>
      <ToggleSwitch
        label='Mode relax'
        helperText='Le mode relax assoupli les vérifications du Validateur BAL'
        checked={isModeRelax}
        disabled={isDisabled}
        onChange={checked => onUpdate({options: {relaxMode: checked}})}
      />
    </div>
  </div>
)

ClientOptions.propTypes = {
  isModeRelax: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired
}

export default ClientOptions
