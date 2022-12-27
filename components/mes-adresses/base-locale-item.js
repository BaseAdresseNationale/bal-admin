import PropTypes from 'prop-types'
import Link from 'next/link'

import {formatDate} from '@/lib/util/date'
import {computeStatus} from '@/lib/bal-status'

const BaseLocaleItem = ({_id, nom, commune, _created, _updated, _deleted, status, sync, nbNumerosCertifies, nbNumeros}) => {
  const computedStatus = computeStatus(status, sync)

  return (
    <tr>
      <td className='fr-col fr-my-1v'>
        {nom}
      </td>
      <td className='fr-col fr-my-1v'>
        {commune}
      </td>
      <td className='fr-col fr-my-1v'>
        {_created ? formatDate(_created) : 'inconnu'}
      </td>
      <td className='fr-col fr-my-1v'>
        {_updated ? formatDate(_updated) : 'inconnu'}
      </td>
      <td className='fr-col fr-my-1v'>
        <p className={`fr-badge fr-badge--${computedStatus.intent} fr-badge--sm fr-badge--no-icon`}>
          {computedStatus.label}
        </p>
      </td>
      <td className='fr-col fr-my-1v'>
        {nbNumerosCertifies} / {nbNumeros}
      </td>
      <td className='fr-col fr-my-1v'>
        <Link href={{
          pathname: '/mes-adresses/base-locale',
          query: {baseLocaleId: _id}
        }}
        >
          <button className='fr-btn fr-btn--icon-right fr-icon-arrow-right-line' type='button' >
            Consulter
          </button>
        </Link>
      </td>
    </tr>
  )
}

BaseLocaleItem.propTypes = {
  _id: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  commune: PropTypes.string.isRequired,
  _created: PropTypes.string.isRequired,
  _updated: PropTypes.string.isRequired,
  _deleted: PropTypes.string,
  status: PropTypes.string.isRequired,
  sync: PropTypes.object,
  nbNumerosCertifies: PropTypes.number.isRequired,
  nbNumeros: PropTypes.number.isRequired
}

export default BaseLocaleItem
