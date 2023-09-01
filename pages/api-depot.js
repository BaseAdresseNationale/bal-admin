import Link from 'next/link'

import Button from '@codegouvfr/react-dsfr/Button'
import Tabs from '@codegouvfr/react-dsfr/Tabs'

import ClientsList from '@/components/api-depot/clients-list'

const APIDepot = () => (

  <div className='fr-container'>
    <Tabs
      className='fr-container fr-my-2w'
      tabs={[
        {label: 'Production', iconId: 'fr-icon-plant-fill', content: (
          <div className='fr-container fr-py-12v'>

            <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--right'>
              <div className='fr-col-2'>
                <Link passHref href={{
                  pathname: '/api-depot/client/client-form',
                }}
                >
                  <Button iconId='fr-icon-add-line'>
                    Ajouter un client
                  </Button>
                </Link>
              </div>
            </div>

            <ClientsList />
          </div>
        )},
        {label: 'Démonstration', iconId: 'fr-icon-seedling-fill', content: (

          <div className='fr-container fr-py-12v'>

            <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--right'>
              <div className='fr-col-2'>
                <Link passHref href={{
                  pathname: '/api-depot/client/client-form',
                  query: {demo: 1}
                }}
                >
                  <Button iconId='fr-icon-add-line'>
                    Ajouter un client
                  </Button>
                </Link>
              </div>
            </div>

            <ClientsList isDemo />
          </div>
        )}
      ]}
    />
  </div>

)

export default APIDepot
