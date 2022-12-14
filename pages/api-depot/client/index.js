import {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import Alert from '@codegouvfr/react-dsfr/Alert'

import {getChefDeFile, getClient, getMandataire, updateClient} from '@/lib/api-depot'

import Main from '@/layouts/main'

import {useUser} from '@/hooks/user'

import Loader from '@/components/loader'
import ClientHeader from '@/components/api-depot/client/client-header'
import ClientOptions from '@/components/api-depot/client/client-options'
import Mandataire from '@/components/api-depot/mandataire'
import ChefDeFile from '@/components/api-depot/chef-de-file'

const Client = ({_client, _mandataire, _chefDeFile}) => {
  const [isAdmin, isLoading] = useUser()

  const [client, setClient] = useState(_client)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState()

  const handleClientUpdate = useCallback(async changes => {
    try {
      setIsUpdating(true)
      const updatedClient = await updateClient(_client._id, changes)
      setClient(updatedClient)
    } catch (error) {
      setError(error.message)
    }

    setIsUpdating(false)
  }, [_client])

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container fr-my-4w'>
            {error && <Alert severity='error' title='Error' description={error} />}

            <ClientHeader
              nom={client.nom}
              isActive={client.active}
              isDisabled={isUpdating}
              onUpdate={handleClientUpdate}
            />

            <ClientOptions
              isModeRelax={client.options.relaxMode}
              isDisabled={isUpdating}
              onUpdate={handleClientUpdate}
            />

            <div className='fr-container fr-my-4w'>
              <h2>Mandataire</h2>
              <Mandataire {..._mandataire} />
            </div>

            <div className='fr-container fr-my-4w'>
              <h2>Chef de file</h2>
              {_chefDeFile ? <ChefDeFile {..._chefDeFile} /> : 'Aucun chef de file'}
            </div>
          </div>
        )}
      </Loader>
    </Main>
  )
}

Client.propTypes = {
  _client: PropTypes.object.isRequired,
  _mandataire: PropTypes.object.isRequired,
  _chefDeFile: PropTypes.object
}

export async function getServerSideProps({query}) {
  let chefDeFile = null
  const client = await getClient(query.clientId)

  if (!client) {
    return {notFound: true}
  }

  const mandataire = await getMandataire(client.mandataire)

  if (client.chefDeFile) {
    chefDeFile = await getChefDeFile(client.chefDeFile)
  }

  return {
    props: {
      _client: client,
      _mandataire: mandataire,
      _chefDeFile: chefDeFile
    }
  }
}

export default Client
