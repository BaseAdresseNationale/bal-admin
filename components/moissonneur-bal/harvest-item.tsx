import Router from 'next/router'

import Button from '@codegouvfr/react-dsfr/Button'
import Badge from '@codegouvfr/react-dsfr/Badge'

import Tooltip from '../tooltip'
import {formatDate} from '@/lib/util/date'
import {getFile} from '@/lib/api-moissonneur-bal'

import UpdateStatusBadge from '@/components/update-status-badge'
import MongoId from '@/components/mongo-id'
import { HarvestMoissonneurType, HarvestStatus } from 'types/moissoneur'

interface StatusBadgeProps {
  status: HarvestStatus;
  error: string;
}

const StatusBadge = ({status, error}: StatusBadgeProps) => {
  if (status === HarvestStatus.ACTIVE) {
    return <Badge severity='info' noIcon>En cours…</Badge>
  }

  if (status === HarvestStatus.FAILED) {
    return (
      <Tooltip text={error}>
        <Badge severity='error' noIcon>Échec</Badge>
      </Tooltip>
    )
  }

  if (status === HarvestStatus.COMPLETED) {
    return <Badge severity='success' noIcon>Terminé</Badge>
  }
}

const HarvestItem = ({_id, startedAt, finishedAt, status, error, updateStatus, updateRejectionReason, fileId}: HarvestMoissonneurType) => {
  const downloadFile = async () => {
    const file = await getFile(fileId)
    Router.push(file.url)
  }

  return (
    <tr>
      <td className='fr-col fr-my-1v'>
        <MongoId id={_id} />
      </td>
      <td className='fr-col fr-my-1v'>
        <a>{formatDate(startedAt)}</a>
      </td>
      <td className='fr-col fr-my-1v'>
        <a>{finishedAt ? formatDate(finishedAt) : '…'}</a>
      </td>
      <td className='fr-col fr-my-1v'>
        <StatusBadge status={status} error={error} />
      </td>
      <td className='fr-col fr-my-1v'>
        <UpdateStatusBadge
          updateStatus={updateStatus}
          updateRejectionReason={updateRejectionReason}
        />
      </td>
      <td className='fr-col fr-my-1v'>
        {fileId && (
          <Button
            iconId='fr-icon-download-line'
            iconPosition='right'
            onClick={downloadFile}
          >
            Télécharger
          </Button>
        )}
      </td>
    </tr>
  )
}

export default HarvestItem
