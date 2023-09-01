import {useEffect, useState} from 'react'
import {Alert} from '@codegouvfr/react-dsfr/Alert'
import {Button} from '@codegouvfr/react-dsfr/Button'
import Link from 'next/link'
import {useRouter} from 'next/router'

import type {ClientApiDepot, MandataireApiDepot, ChefDeFileApiDepot} from 'types/api-depot'
import Loader from '@/components/loader'
import {getChefDeFile, getClient, getMandataire} from '@/lib/api-depot'

import ClientHeader from '@/components/api-depot/client/client-header'
import Mandataire from '@/components/api-depot/mandataire'
import ChefDeFile from '@/components/api-depot/chef-de-file'

const Client = () => {
  const router = useRouter()
  const {clientId, demo} = router.query
  const isDemo = demo === '1'
  const [client, setClient] = useState<ClientApiDepot>(null)
  const [chefDeFile, setChefDeFile] = useState<ChefDeFileApiDepot>(null)
  const [mandataire, setMandataire] = useState<MandataireApiDepot>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const client = await getClient(clientId, isDemo)
      setClient(client)

      const mandataire = await getMandataire(client.mandataire, isDemo)
      setMandataire(mandataire)

      if (client.chefDeFile) {
        const chefDeFile = await getChefDeFile(client.chefDeFile, isDemo)
        setChefDeFile(chefDeFile)
      }

      setIsLoading(false)
    }

    void fetchData()
  }, [clientId, isDemo])

  return (
    <Loader isLoading={isLoading}>
      {client ? <div className='fr-container fr-my-4w'>
        {isDemo && (
          <Alert
            className='fr-mt-4v'
            title='Client de démonstration'
            description='Client de démonstration'
            severity='info'
            small
          />
        )}

        <Link passHref href={{
          pathname: '/api-depot/client/client-form',
          query: {clientId: client._id, demo: isDemo ? 1 : 0},
        }}
        >
          <Button iconId='fr-icon-edit-line'>
            Modifier le client
          </Button>
        </Link>

        <ClientHeader id={client._id} nom={client.nom} token={client.token} />

        <Mandataire {...mandataire} />

        <ChefDeFile hasChefDeFile={chefDeFile !== null} {...chefDeFile} />

      </div> : <Alert
        title='Erreur'
        description="Le client n'a pas été trouvé"
        severity='error'
        small
      />}
    </Loader>
  )
}

export default Client