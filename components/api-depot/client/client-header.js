import PropTypes from 'prop-types'

import ToggleSwitch from '@codegouvfr/react-dsfr/ToggleSwitch'
import MongoId from '@/components/mongo-id'

const ClientHeader = ({id, nom, isActive, isDisabled, onUpdate}) => (
  <div className='fr-container fr-py-12v'>
    <div className='fr-grid-row fr-grid-row--gutters'>
      <div className='fr-col-10'>
        <h1>{nom}</h1>
        <MongoId id={id} />
      </div>

      <div className='fr-col-2'>
        <ToggleSwitch
          label=''
          checked={isActive}
          disabled={isDisabled}
          onChange={checked => onUpdate({active: checked})}
        />
      </div>
    </div>
  </div>
)

ClientHeader.propTypes = {
  id: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired
}

export default ClientHeader
