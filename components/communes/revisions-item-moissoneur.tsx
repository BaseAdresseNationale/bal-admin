import Link from 'next/link'

import type {RevisionMoissoneurType} from '../../types/moissoneur'
import UpdateStatusBadge from '@/components/update-status-badge'
import {RevisionPublication} from '@/components/revision-publication'
import MongoId from '@/components/mongo-id'
import Tooltip from '@/components/tooltip'

export const RevisionItemMoissoneur = (
  {_id, sourceId, nbRows, nbRowsWithErrors, updateStatus, updateRejectionReason, publication}: RevisionMoissoneurType,
) => (
  <tr key={_id}>
    <td className='fr-col fr-my-1v'>
      <MongoId id={_id} />
    </td>
    <td className='fr-col fr-my-1v'>
      <Tooltip text={sourceId}>
        <Link legacyBehavior passHref href={{pathname: `/moissonneur-bal/sources/${sourceId}`}}>
          {sourceId}
        </Link>
      </Tooltip>
    </td>
    <td className='fr-col fr-my-1v'>
      {nbRows}
    </td>
    <td className='fr-col fr-my-1v'>
      {nbRowsWithErrors}
    </td>

    <td className='fr-col fr-my-1v'>
      <UpdateStatusBadge
        updateStatus={updateStatus}
        updateRejectionReason={updateRejectionReason}
      />
    </td>
    <td className='fr-col fr-my-1v'>
      <RevisionPublication {...publication} />
    </td>
  </tr>
)
