import PropTypes from 'prop-types'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Button from '@codegouvfr/react-dsfr/Button'
import Link from 'next/link'

import {getChefDeFile, getClient, getMandataire} from '@/lib/api-depot'

import Main from '@/layouts/main'

import {useUser} from '@/hooks/user'

import Loader from '@/components/loader'
import ClientHeader from '@/components/api-depot/client/client-header'
import Mandataire from '@/components/api-depot/mandataire'
import ChefDeFile from '@/components/api-depot/chef-de-file'

const Client = ({_client, _mandataire, _chefDeFile, isDemo}) => {
  const [isAdmin, isLoading] = useUser()

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container fr-my-4w'>
            {isDemo && (
              <Alert
                className='fr-mt-4v'
                title='Client de démonstration'
                severity='info'
                small
              />
            )}

            <Link passHref href={{
              pathname: '/api-depot/client/client-form',
              query: {clientId: _client._id, demo: isDemo ? 1 : 0}
            }}
            >
              <Button iconId='fr-icon-edit-line'>
                Modifier le client
              </Button>
            </Link>

            <ClientHeader id={_client._id} nom={_client.nom} token={_client.token} />

            <Mandataire {..._mandataire} />

            <ChefDeFile hasChefDeFile={_chefDeFile !== null} {..._chefDeFile} />

          </div>
        )}
      </Loader>
    </Main>
  )
}

Client.propTypes = {
  _client: PropTypes.object.isRequired,
  _mandataire: PropTypes.object.isRequired,
  _chefDeFile: PropTypes.object,
  isDemo: PropTypes.bool.isRequired
}

export async function getServerSideProps({query}) {
  let chefDeFile = null
  const isDemo = query.demo === '1'
  const client = await getClient(query.clientId, isDemo)

  if (!client) {
    return {notFound: true}
  }

  const mandataire = await getMandataire(client.mandataire, isDemo)

  if (client.chefDeFile) {
    chefDeFile = await getChefDeFile(client.chefDeFile, isDemo)
  }

  return {
    props: {
      _client: client,
      _mandataire: mandataire,
      _chefDeFile: chefDeFile,
      isDemo
    }
  }
}

export default Client
