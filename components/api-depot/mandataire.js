import PropTypes from 'prop-types'

import MongoId from '@/components/mongo-id'

const Mandataire = ({_id, nom, email}) => (
  <div className='fr-container'>
    <div className='fr-grid-row fr-grid-row--gutters'>
      <div className='fr-col'>
        <h3>{nom}</h3>
        <MongoId id={_id} />
      </div>
      <div className='fr-col'>
        <a href={`emailTo:${email}`}>{email}</a>
      </div>
    </div>
  </div>
)

Mandataire.propTypes = {
  _id: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
}

export default Mandataire
