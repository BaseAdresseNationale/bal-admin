import Link from 'next/link'
import {Badge} from '@codegouvfr/react-dsfr/Badge'
import {Button} from '@codegouvfr/react-dsfr/Button'

import type {Bals} from '../../types/mes-adresses'
import {computeStatus} from '@/lib/bal-status'
import {formatDate} from '@/lib/util/date'

export const BalsItem = ({_id, nom, status, sync, _created, _updated}: Bals) => (
  <tr key={_id}>
    <td className='fr-col fr-my-1v'>{_id}</td>
    <td className='fr-col fr-my-1v'>{nom}</td>
    <td className='fr-col fr-my-1v'>
      <Badge severity={computeStatus(status, sync).intent} noIcon>{computeStatus(status, sync).label}</Badge>
    </td>
    <td className='fr-col fr-my-1v'>
      {_created ? formatDate(_created) : 'inconnu'}
    </td>
    <td className='fr-col fr-my-1v'>
      {_updated ? formatDate(_updated) : 'inconnu'}
    </td>
    <td className='fr-col fr-my-1v'>
      <Link passHref href={{pathname: '/mes-adresses/base-locale', query: {baseLocaleId: _id}}}>
        <Button iconId='fr-icon-arrow-right-line' iconPosition='right'>
          Consulter
        </Button>
      </Link>
    </td>
  </tr>
)

