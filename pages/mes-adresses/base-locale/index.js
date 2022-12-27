import PropTypes from 'prop-types'
import Link from 'next/link'

import {getBaseLocale} from '@/lib/api-mes-adresses'
import {computeStatus} from '@/lib/bal-status'

import {useUser} from '@/hooks/user'

import Main from '@/layouts/main'

import Loader from '@/components/loader'
import {formatDate} from '@/lib/util/date'

const NEXT_PUBLIC_MES_ADRESSES_URL = process.env.NEXT_PUBLIC_MES_ADRESSES_URL || 'http://mes-adresses.data.gouv.fr'

const BaseLocale = ({baseLocale}) => {
  const {_id, nom, commune, status, sync, enableComplement, nbNumerosCertifies, nbNumeros, _created, _updated, _deleted} = baseLocale
  const [isAdmin, isLoading] = useUser()

  const computedStatus = computeStatus(status, sync)

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container'>

            {_deleted && (
              <div className='fr-alert fr-alert--error'>
                <h3 className='fr-alert__title'>Cette Base Adresse Locale a été supprimée</h3>
                <p>La Base Adresse Locale a été supprimée le <b>{formatDate(_deleted)}</b></p>
              </div>
            )}

            <div className='fr-container fr-py-12v'>
              <div className='fr-grid-row fr-grid-row--gutters'>
                <div className='fr-col-10'>
                  <h1>{nom} ({commune})</h1>

                  <div className='fr-my-4v'>
                    <p className={`fr-badge fr-badge--${computedStatus.intent} fr-badge--sm fr-badge--no-icon`}>
                      {computedStatus.label}
                    </p>
                  </div>

                  <ul className='fr-tags-group'>
                    <li>
                      <p className='fr-tag'>Création : <b className='fr-mx-1v'>{formatDate(_created, 'PPP')}</b></p>
                    </li>
                    <li>
                      <p className='fr-tag'>Mise à jour : <b className='fr-mx-1v'>{formatDate(_updated, 'PPP')}</b></p>
                    </li>
                    <li>
                      <p className='fr-tag'>{nbNumerosCertifies} / {nbNumeros} numéros certifiés</p>
                    </li>
                  </ul>
                </div>

                <div className='fr-col-2'>
                  <div className='fr-container'>
                    <Link href={`${NEXT_PUBLIC_MES_ADRESSES_URL}/bal/${_id}`}>
                      <a className='fr-link fr-fi-arrow-right-line fr-link--icon-right'>Consulter</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className='fr-container'>
              <h2>Paramètres</h2>
              <div className='fr-container'>
                <div className='fr-checkbox-group'>
                  <input type='checkbox' id='enabledComplement' name='enabledComplement' checked={enableComplement} disabled />
                  <label className='fr-label' htmlFor='enabledComplement'>Complément de voie</label>
                </div>
              </div>
            </div>

          </div>
        )}
      </Loader>
    </Main>
  )
}

BaseLocale.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    enableComplement: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    _created: PropTypes.string.isRequired,
    _updated: PropTypes.string.isRequired,
    commune: PropTypes.string.isRequired,
    _deleted: PropTypes.string,
    nbNumeros: PropTypes.number.isRequired,
    nbNumerosCertifies: PropTypes.number.isRequired,
    isAllCertified: PropTypes.bool.isRequired,
    commentedNumeros: PropTypes.array.isRequired,
    sync: PropTypes.object
  }).isRequired
}

export async function getServerSideProps({query}) {
  const baseLocale = await getBaseLocale(query.baseLocaleId)

  return {
    props: {
      baseLocale
    }
  }
}

export default BaseLocale
