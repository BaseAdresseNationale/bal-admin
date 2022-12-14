import PropTypes from 'prop-types'

import Main from '@/layouts/main'
import {getSources} from '@/lib/api-moissonneur-bal'

import MoissoneurSourceItem from '@/components/moissonneur-bal/moissonneur-source-item'
import Loader from '@/components/loader'
import {useUser} from '@/hooks/user'

const MoissoneurBAL = ({sources}) => {
  const [isAdmin, isLoading] = useUser()

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container fr-py-12v'>
            <div className='fr-table'>
              <table>
                <caption>Liste des sources moissonnées</caption>
                <thead>
                  <tr>
                    <th scope='col'>Nom</th>
                    <th scope='col'>Modèle</th>
                    <th scope='col'>Type</th>
                    <th scope='col'>Date de mise à jour</th>
                    <th scope='col' />
                  </tr>
                </thead>

                <tbody>
                  {sources.filter(s => !s._deleted).map(source => (
                    <MoissoneurSourceItem key={source._id} {...source} />
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

MoissoneurBAL.propTypes = {
  sources: PropTypes.array.isRequired
}

export async function getServerSideProps({query}) {
  const sources = await getSources(query.sourceId)

  return {
    props: {sources}
  }
}

export default MoissoneurBAL

