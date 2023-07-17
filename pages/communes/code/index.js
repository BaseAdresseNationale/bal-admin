import PropTypes from 'prop-types'

import {useUser} from '@/hooks/user'
import Main from '@/layouts/main'
import {getCommune} from '@/lib/cog'
import MesAdresseList from '@/components/communes/mes-adresses-list'
import MoissoneurList from '@/components/communes/moissoneur-list'
import ApiDepotList from '@/components/communes/api-depot-list'
import Loader from '@/components/loader'

const CommuneSource = ({code}) => {
  const [isAdmin, isLoading] = useUser()

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container fr-my-4w'>
            <h1>{getCommune(code).nom} ({code})</h1>
            <MesAdresseList code={code} />
            <MoissoneurList code={code} />
            <ApiDepotList code={code} />
          </div>
        )}
      </Loader>
    </Main>
  )
}

CommuneSource.propTypes = {
  code: PropTypes.string.isRequired
}

export async function getServerSideProps({query}) {
  const {code} = query
  return {props: {code}}
}

export default CommuneSource
