import PropTypes from 'prop-types'
import Link from 'next/link'

import Button from '@codegouvfr/react-dsfr/Button'
import Badge from '@codegouvfr/react-dsfr/Badge'

import {formatDate} from '@/lib/util/date'
import {computeStatus} from '@/lib/bal-status'
import {getCommune} from '@/lib/cog'

const BaseLocaleItem = ({_id, nom, commune, _created, _updated, _deleted, status, sync, nbNumerosCertifies, nbNumeros}) => {
  const computedStatus = computeStatus(status, sync)

  return (
    <tr>
      <td className='fr-col fr-my-1v'>
        {nom}
      </td>
      <td className='fr-col fr-my-1v'>
        {getCommune(commune).nom} ({commune})
      </td>
      <td className='fr-col fr-my-1v'>
        {_created ? formatDate(_created) : 'inconnu'}
      </td>
      <td className='fr-col fr-my-1v'>
        {_updated ? formatDate(_updated) : 'inconnu'}
      </td>
      <td className='fr-col fr-my-1v'>
        <Badge label={computedStatus.label} severity={computedStatus.intent} noIcon />
      </td>
      <td className='fr-col fr-my-1v'>
        {nbNumerosCertifies} / {nbNumeros}
      </td>
      <td className='fr-col fr-my-1v'>
        <Link passHref href={{
          pathname: '/mes-adresses/base-locale',
          query: {baseLocaleId: _id}
        }}
        >
          <Button iconId='fr-icon-arrow-right-line' iconPosition='right'>
            Consulter
          </Button>
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
