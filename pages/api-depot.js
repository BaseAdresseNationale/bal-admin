import PropTypes from 'prop-types'

import {getChefsDeFile, getClients, getMandataires} from '@/lib/api-depot'

import Main from '@/layouts/main'
import ClientItem from '@/components/api-depot/client-item'
import {useUser} from '@/hooks/user'
import Loader from '@/components/loader'

const APIDepot = ({clients, mandataires, chefsDeFile}) => {
  const [isAdmin, isLoading] = useUser()

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container fr-py-12v'>
            <div className='fr-table'>
              <table>
                <caption>Liste des clients de l’API dépôt</caption>
                <thead>
                  <tr>
                    <th scope='col'>Nom</th>
                    <th scope='col'>Mandataire</th>
                    <th scope='col'>Chef de file</th>
                    <th scope='col'>Stratégie d’autorisation</th>
                    <th scope='col'>Activé</th>
                    <th scope='col'>Mode relax</th>
                  </tr>
                </thead>

                <tbody>
                  {clients.map(client => (
                    <ClientItem
                      key={client._id}
                      {...client}
                      mandataire={mandataires.find(({_id}) => _id === client.mandataire)}
                      chefDeFile={chefsDeFile.find(({_id}) => _id === client.chefDeFile)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Loader>
    </Main>
  )
}

APIDepot.propTypes = {
  clients: PropTypes.array.isRequired,
  mandataires: PropTypes.array.isRequired,
  chefsDeFile: PropTypes.array.isRequired
}

export async function getServerSideProps() {
  return {
    props: {
      clients: await getClients(),
      mandataires: await getMandataires(),
      chefsDeFile: await getChefsDeFile()
    }
  }
}

export default APIDepot
