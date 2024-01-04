import {useEffect, useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {Badge} from '@codegouvfr/react-dsfr/Badge'

import {Alert} from '@codegouvfr/react-dsfr/Alert'
import type {BaseLocaleType} from 'types/mes-adresses'
import {getBaseLocale} from '@/lib/api-mes-adresses'
import {computeStatus} from '@/lib/bal-status'
import {formatDate} from '@/lib/util/date'

import CopyToClipBoard from '@/components/copy-to-clipboard'

const NEXT_PUBLIC_MES_ADRESSES_URL = process.env.NEXT_PUBLIC_MES_ADRESSES_URL || 'http://mes-adresses.data.gouv.fr'

const BaseLocale = () => {
  const router = useRouter()
  const {baseLocaleId} = router.query
  const [baseLocale, setBaseLocale] = useState<BaseLocaleType>(null)

  useEffect(() => {
    async function fetchBaseLocale() {
      const baseLocale = await getBaseLocale(baseLocaleId as string)
      setBaseLocale(baseLocale)
    }

    void fetchBaseLocale()
  }, [baseLocaleId])

  const computedStatus = baseLocale && computeStatus(baseLocale.status, baseLocale.sync)

  return (baseLocale ? (
    <div className='fr-container'>

      {baseLocale._deleted && (
        <Alert
          className='fr-mt-4v'
          title='Cette Base Adresse Locale a été supprimée'
          severity='error'
          description={`La Base Adresse Locale a été supprimée le ${formatDate(baseLocale._deleted)}`}
        />
      )}

      <div className='fr-container fr-py-12v'>
        <div className='fr-grid-row fr-grid-row--gutters'>
          <div className='fr-col-10'>
            <h1>{baseLocale.nom} ({baseLocale.commune})</h1>
            <CopyToClipBoard text={baseLocale._id} title='Id' />
            {baseLocale.token && <CopyToClipBoard text={baseLocale.token} title='Token' /> }
            <div className='fr-my-4v'>
              <Badge severity={computedStatus.intent} noIcon>{computedStatus.label}</Badge>
            </div>

            <ul className='fr-tags-group'>
              <li>
                <p className='fr-tag'>Création : <b className='fr-mx-1v'>{formatDate(baseLocale._created, 'PPP')}</b></p>
              </li>
              <li>
                <p className='fr-tag'>Mise à jour : <b className='fr-mx-1v'>{formatDate(baseLocale._updated, 'PPP')}</b></p>
              </li>
              <li>
                <p className='fr-tag'>{baseLocale.nbNumerosCertifies} / {baseLocale.nbNumeros} numéros certifiés</p>
              </li>
            </ul>
          </div>

          <div className='fr-col-2'>
            <div className='fr-container'>
              <Link href={`${NEXT_PUBLIC_MES_ADRESSES_URL}/bal/${baseLocale._id}/${baseLocale.token}`}>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  className='fr-link fr-fi-arrow-right-line fr-link--icon-right'
                >
                  Consulter
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='fr-container'>
        <h2>Paramètres</h2>
        <div className='fr-container'>
          <div className='fr-checkbox-group'>
            <input type='checkbox' id='enabledComplement' name='enabledComplement' checked={Boolean(baseLocale.enableComplement)} disabled />
            <label className='fr-label' htmlFor='enabledComplement'>Complément de voie</label>
          </div>
        </div>
      </div>
    </div>
  ) : null)
}

export default BaseLocale
