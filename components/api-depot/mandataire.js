import PropTypes from 'prop-types'

const Mandataire = ({nom, email}) => (
  <div className='fr-container'>
    <div className='fr-grid-row fr-grid-row--gutters'>
      <div className='fr-col'>
        <h3>{nom}</h3>
      </div>
      <div className='fr-col'>
        <a href={`emailTo:${email}`}>{email}</a>
      </div>
    </div>
  </div>
)

Mandataire.propTypes = {
  nom: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
}

export default Mandataire
