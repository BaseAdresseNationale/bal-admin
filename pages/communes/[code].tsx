import {useState, useEffect, useMemo} from 'react'
import type {RevisionMoissoneur} from '../../types/moissoneur'
import type {RevisionApiDepot} from '../../types/api-depot'
import type {Page} from '../../types/page'
import type {Bals} from '../../types/mes-adresses'
import {useUser} from '@/hooks/user'
import Main from '@/layouts/main'
import {getCommune} from '@/lib/cog'
import Loader from '@/components/loader'

import {getAllRevisionByCommune} from '@/lib/api-depot'
import {searchBasesLocales} from '@/lib/api-mes-adresses'
import {getRevisionsByCommune} from '@/lib/api-moissonneur-bal'

import {EditableList} from '@/components/editable-list'
import {RevisionItemApiDepot} from '@/components/communes/revisions-item-api-depot'
import {RevisionItemMoissoneur} from '@/components/communes/revisions-item-moissoneur'
import {BalsItem} from '@/components/communes/bals-item'

type CommuneSourcePageProps = {
  code: string;
  initialRevisionsApiDepot: RevisionApiDepot[];
  initialRevisionsMoissonneur: RevisionMoissoneur[];
  balsPage: Page<Bals>;
}

const CommuneSource = (
  {code, initialRevisionsApiDepot, initialRevisionsMoissonneur, balsPage}: CommuneSourcePageProps,
) => {
  const [isAdmin, isLoading] = useUser()
  const [bals, setBals] = useState(balsPage.results)

  const [pageApiDepot, setPageApiDepot] = useState({
    limit: 5,
    count: initialRevisionsApiDepot.length,
    current: 1,
  })

  const [pageMoissonneur, setPageMoissonneur] = useState({
    limit: 5,
    count: initialRevisionsMoissonneur.length,
    current: 1,
  })

  const [pageMesAdresses, setPageMesAdresses] = useState({
    limit: 5,
    count: balsPage.count,
    current: 1,
  })

  const onPageMoissonneurChange = (newPage: number) => {
    setPageMoissonneur(setPageMoissonneur => ({...setPageMoissonneur, current: newPage}))
  }

  const onPageMesAdressesChange = (newPage: number) => {
    setPageMesAdresses(setPageMesAdresses => ({...setPageMesAdresses, current: newPage}))
  }

  const onPageApiDepotChange = (newPage: number) => {
    setPageApiDepot(pageApiDepot => ({...pageApiDepot, current: newPage}))
  }

  useEffect(() => {
    const fetchBals = async (commune: string) => {
      const res = await searchBasesLocales({commune, page: pageMesAdresses.current, limit: pageMesAdresses.limit})
      setBals(res.results)
    }

    fetchBals(code).catch(console.error)
  }, [pageMesAdresses, code])

  const revisionsApiDepot = useMemo(() => {
    const start = (pageApiDepot.current - 1) * pageApiDepot.limit
    const end = (pageApiDepot.current) * pageApiDepot.limit
    return initialRevisionsApiDepot.slice(start, end)
  }, [pageApiDepot, initialRevisionsApiDepot])

  const revisionsMoissoneur = useMemo(() => {
    const start = (pageMoissonneur.current - 1) * pageMoissonneur.limit
    const end = (pageMoissonneur.current) * pageMoissonneur.limit
    return initialRevisionsMoissonneur.slice(start, end)
  }, [pageMoissonneur, initialRevisionsMoissonneur])

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container fr-my-4w'>
            <h1>{getCommune(code).nom} ({code})</h1>

            <EditableList
              headers={['Id', 'Client', 'Status', 'Date création', 'Date mise à jour', '']}
              caption='Bals mes adresses'
              data={bals}
              renderItem={BalsItem}
              page={{...pageMesAdresses, onPageChange: onPageMesAdressesChange}}
            />

            <EditableList
              headers={['Id', 'Source', 'Nb lignes', 'Nb lignes erreurs', 'Status', 'Publication']}
              caption='Révisions Moissoneur'
              data={revisionsMoissoneur}
              renderItem={RevisionItemMoissoneur}
              page={{...pageMoissonneur, onPageChange: onPageMoissonneurChange}}
            />

            <EditableList
              headers={['Id', 'Client', 'Status', 'Current', 'Validation', 'Date création', 'Date publication']}
              caption='Révisions Api Depot'
              data={revisionsApiDepot}
              renderItem={RevisionItemApiDepot}
              page={{...pageApiDepot, onPageChange: onPageApiDepotChange}}
            />
          </div>
        )}
      </Loader>
    </Main>
  )
}

export async function getServerSideProps({params}) {
  const {code} = params
  const initialRevisionsApiDepot = await getAllRevisionByCommune(code)
  const initialRevisionsMoissonneur = await getRevisionsByCommune(code)
  const balsPage = await searchBasesLocales({commune: code, page: 1, limit: 5})
  return {props: {code, initialRevisionsApiDepot, initialRevisionsMoissonneur, balsPage}}
}

export default CommuneSource
