import PropTypes from 'prop-types'

const ClientItem = ({nom, mandataire, chefDeFile, authorizationStrategy, active, options}) => (
  <tr>
    <td className='fr-col fr-my-1v'>
      {nom}
    </td>
    <td className='fr-col fr-my-1v'>
      {mandataire.nom}
    </td>
    <td className='fr-col fr-my-1v'>
      {chefDeFile ? chefDeFile.nom : '-'}
    </td>
    <td className='fr-col fr-my-1v'>
      {authorizationStrategy}
    </td>
    <td className='fr-col fr-my-1v'>
      <input type='checkbox' id='checkbox' name='checkbox' checked={active} disabled />
    </td>
    <td className='fr-col fr-my-1v'>
      <input type='checkbox' id='checkbox' name='checkbox' checked={options.relaxMode} disabled />
    </td>
  </tr>
)

ClientItem.propTypes = {
  nom: PropTypes.string.isRequired,
  mandataire: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }).isRequired,
  chefDeFile: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }),
  authorizationStrategy: PropTypes.oneOf(['habilitation', 'chef-de-file']).isRequired,
  active: PropTypes.bool.isRequired,
  options: PropTypes.shape({
    relaxMode: PropTypes.bool.isRequired
  }).isRequired
}

export default ClientItem
