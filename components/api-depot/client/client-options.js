import PropTypes from 'prop-types'

import ToggleInput from '@/components/toggle-input'

const ClientOptions = ({isModeRelax, isDisabled, onUpdate}) => (
  <div className='fr-container fr-py-12v'>
    <h2>Options</h2>
    <div>
      <ToggleInput
        label='Mode relax'
        hint='Le mode relax assoupli les vérifications du Validateur BAL'
        isCheck={isModeRelax}
        isDisabled={isDisabled}
        handleChange={checked => onUpdate({options: {relaxMode: checked}})}
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
