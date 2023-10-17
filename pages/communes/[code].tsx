import {useState, useEffect, useMemo, useCallback} from 'react'
import {toast} from 'react-toastify'
import type {RevisionMoissoneurType} from '../../types/moissoneur'
import type {RevisionApiDepotType} from '../../types/api-depot'
import type {PageType} from '../../types/page'
import type {BaseLocaleType} from '../../types/mes-adresses'
import {getCommune} from '@/lib/cog'

import {ModalAlert} from '@/components/modal-alerte'
import {getAllRevisionByCommune} from '@/lib/api-depot'
import {searchBasesLocales, removeBaseLocale} from '@/lib/api-mes-adresses'
import {getRevisionsByCommune} from '@/lib/api-moissonneur-bal'

import {EditableList} from '@/components/editable-list'
import {RevisionItemApiDepot} from '@/components/communes/revisions-item-api-depot'
import {RevisionItemMoissoneur} from '@/components/communes/revisions-item-moissoneur'
import {BalsItem} from '@/components/communes/bals-item'

type CommuneSourcePageProps = {
  code: string;
  balsPage: PageType<BaseLocaleType>;
}

const CommuneSource = (
  {code, balsPage}: CommuneSourcePageProps,
) => {
  const [bals, setBals] = useState(balsPage.results)
  const [initialRevisionsApiDepot, setInitialRevisionsApiDepot] = useState<RevisionApiDepotType[]>([])
  const [initialRevisionsMoissonneur, setInitialRevisionsMoissonneur] = useState<RevisionMoissoneurType[]>([])
  const [balToDeleted, setBalToDeleted] = useState(null)

  const [pageApiDepot, setPageApiDepot] = useState({
    limit: 10,
    count: 0,
    current: 1,
  })

  const [pageMoissonneur, setPageMoissonneur] = useState({
    limit: 10,
    count: 0,
    current: 1,
  })

  const [pageMesAdresses, setPageMesAdresses] = useState({
    limit: 10,
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

  const fetchBals = useCallback(async (commune: string) => {
    const res = await searchBasesLocales({commune, page: pageMesAdresses.current, limit: pageMesAdresses.limit})
    setBals(res.results)
  }, [pageMesAdresses])

  useEffect(() => {
    const fetchData = async () => {
      const initialRevisionsApiDepot: RevisionApiDepotType[] = await getAllRevisionByCommune(code)
      const initialRevisionsMoissonneur: RevisionMoissoneurType[] = await getRevisionsByCommune(code)

      // Show the last revisions first
      setInitialRevisionsApiDepot(initialRevisionsApiDepot.reverse())
      setPageApiDepot(pageApiDepot => ({...pageApiDepot, count: initialRevisionsApiDepot.length}))

      setInitialRevisionsMoissonneur(initialRevisionsMoissonneur.reverse())
      setPageMoissonneur(pageMoissonneur => ({...pageMoissonneur, count: initialRevisionsMoissonneur.length}))
    }

    fetchData().catch(console.error)
  }, [code])

  useEffect(() => {
    fetchBals(code).catch(console.error)
  }, [pageMesAdresses, code, fetchBals])

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

  const onDeleteBal = useCallback(async () => {
    try {
      await removeBaseLocale(balToDeleted._id)
      await fetchBals(code).catch(console.error)
      setBalToDeleted(null)
      toast('La BAL a bien été archivé', {type: 'success'})
    } catch (e: unknown) {
      console.error(e)
      if (e instanceof Error) {
        toast(e.message, {type: 'error'})
      }
    }
  }, [balToDeleted, code, fetchBals, setBalToDeleted])

  const actionsBals = {
    delete(item: BaseLocaleType) {
      setBalToDeleted(item)
    },
  }

  return (
    <div className='fr-container fr-my-4w'>
      <ModalAlert item={balToDeleted} setItem={setBalToDeleted} onAction={onDeleteBal} title='Voulez vous vraiment supprimer cette bal ?' />

      <h1>{getCommune(code).nom} ({code})</h1>

      <EditableList
        headers={['Id', 'Client', 'Status', 'Date création', 'Date mise à jour', 'Consulter', 'Supprimer']}
        caption='Bals mes adresses'
        data={bals}
        renderItem={BalsItem}
        page={{...pageMesAdresses, onPageChange: onPageMesAdressesChange}}
        actions={actionsBals}
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
  )
}

export async function getServerSideProps({params}) {
  const {code} = params
  const balsPage = await searchBasesLocales({commune: code, page: 1, limit: 5})
  return {props: {code, balsPage}}
}

export default CommuneSource
