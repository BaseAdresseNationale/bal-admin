import PropTypes from 'prop-types'

import ToggleInput from '@/components/toggle-input'

const ClientHeader = ({nom, isActive, isDisabled, onUpdate}) => (
  <div className='fr-container fr-py-12v'>
    <div className='fr-grid-row fr-grid-row--gutters'>
      <div className='fr-col-10'>
        <h1>{nom}</h1>
      </div>

      <div className='fr-col-2'>
        <div className='fr-container'>
          <ToggleInput
            label=''
            isCheck={isActive}
            isDisabled={isDisabled}
            handleChange={checked => onUpdate({active: checked})}
          />
        </div>
      </div>
    </div>
  </div>
)

ClientHeader.propTypes = {
  nom: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired
}

export default ClientHeader
