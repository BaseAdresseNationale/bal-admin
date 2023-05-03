import PropTypes from 'prop-types'
import {useEffect, useState} from 'react'

import Alert from '@codegouvfr/react-dsfr/Alert'
import {getChefsDeFile, getClients, getMandataires} from '@/lib/api-depot'

import ClientItem from '@/components/api-depot/client-item'

const ClientsList = ({isDemo}) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [clients, mandataires, chefsDeFile] = await Promise.all([
          getClients(isDemo),
          getMandataires(isDemo),
          getChefsDeFile(isDemo)
        ])

        setData({clients, mandataires, chefsDeFile})
      } catch (error) {
        setError(`Impossible de charger les données : ${error.message}`)
      }
    }

    fetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <Alert
        className='fr-my-2w'
        title='Erreur'
        description={error}
        severity='error'
        closable={false}
        small
      />
    )
  }

  return (
    <div className='fr-table'>
      {data ? (
        <table>
          <caption>Liste des clients de l’API dépôt {isDemo ? ' - [DÉMONSTRATION]' : ''}</caption>
          <thead>
            <tr>
              <th scope='col'>Nom</th>
              <th scope='col'>Mandataire</th>
              <th scope='col'>Chef de file</th>
              <th scope='col'>Stratégie d’autorisation</th>
              <th scope='col'>Activé</th>
              <th scope='col'>Mode relax</th>
              <th scope='col'>Editer</th>
              <th scope='col'>Consulter</th>
            </tr>
          </thead>

          <tbody>
            {data?.clients.map(client => (
              <ClientItem
                key={client._id}
                {...client}
                mandataire={data.mandataires.find(({_id}) => _id === client.mandataire)}
                chefDeFile={data.chefsDeFile.find(({_id}) => _id === client.chefDeFile)}
                isDemo={isDemo}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div>Chargement…</div>
      )}
    </div>
  )
}

ClientsList.defaultProps = {
  isDemo: false
}

ClientsList.propTypes = {
  isDemo: PropTypes.bool
}

export default ClientsList
