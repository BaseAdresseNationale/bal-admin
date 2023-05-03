import Button from '@codegouvfr/react-dsfr/Button'
import Link from 'next/link'
import PropTypes from 'prop-types'

const ClientItem = ({_id, nom, mandataire, chefDeFile, authorizationStrategy, active, options, isDemo}) => (
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
    <td className='fr-col fr-my-1v'>
      <Link passHref href={{
        pathname: '/api-depot/client/client-form',
        query: {clientId: _id, demo: isDemo ? 1 : 0}
      }}
      >
        <Button iconId='fr-icon-edit-line' iconPosition='right'>
          Editer
        </Button>
      </Link>
    </td>
    <td className='fr-col fr-my-1v'>
      <Link passHref href={{
        pathname: '/api-depot/client',
        query: {clientId: _id, demo: isDemo ? 1 : 0}
      }}
      >
        <Button iconId='fr-icon-arrow-right-line' iconPosition='right'>
          Consulter
        </Button>
      </Link>
    </td>
  </tr>
)

ClientItem.propTypes = {
  _id: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  mandataire: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }).isRequired,
  chefDeFile: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }),
  authorizationStrategy: PropTypes.oneOf(['habilitation', 'chef-de-file', 'internal']).isRequired,
  active: PropTypes.bool.isRequired, // eslint-disable-line react/boolean-prop-naming
  options: PropTypes.shape({
    relaxMode: PropTypes.bool.isRequired
  }).isRequired,
  isDemo: PropTypes.bool.isRequired
}

export default ClientItem
