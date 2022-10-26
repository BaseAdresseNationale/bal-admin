import PropTypes from 'prop-types'

import Main from '@/layouts/main'
import {getSources} from '@/lib/api-moissonneur-bal'

import MoissoneurSourceItem from '@/components/moissonneur-ban/moissonneur-source-item'

const MoissoneurBAL = ({sources}) => (
  <Main>
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
  </Main>
)

MoissoneurBAL.propTypes = {
  sources: PropTypes.array.isRequired
}

export async function getServerSideProps() {
  const sources = await getSources()

  return {
    props: {sources}
  }
}

export default MoissoneurBAL

