import PropTypes from 'prop-types'
import Router from 'next/router'

import Button from '@codegouvfr/react-dsfr/Button'
import Badge from '@codegouvfr/react-dsfr/Badge'

import Tooltip from '../tooltip'
import {formatDate} from '@/lib/util/date'
import {getFile} from '@/lib/api-moissonneur-bal'

import UpdateStatusBadge from '@/components/update-status-badge'
import MongoId from '@/components/mongo-id'

const StatusBadge = ({status, error}) => {
  if (status === 'active') {
    return <Badge severity='info' noIcon>En cours…</Badge>
  }

  if (status === 'failed') {
    return (
      <Tooltip text={error}>
        <Badge severity='error' noIcon>Échec</Badge>
      </Tooltip>
    )
  }

  if (status === 'completed') {
    return <Badge severity='success' noIcon>Terminé</Badge>
  }
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['completed', 'active', 'failed']),
  error: PropTypes.string
}

const HarvestItem = ({_id, startedAt, finishedAt, status, error, updateStatus, updateRejectionReason, fileId}) => {
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

HarvestItem.propTypes = {
  _id: PropTypes.string.isRequired,
  startedAt: PropTypes.string.isRequired,
  finishedAt: PropTypes.string,
  status: PropTypes.string,
  error: PropTypes.string,
  updateStatus: PropTypes.oneOf(['unchanged', 'rejected', 'updated']),
  updateRejectionReason: PropTypes.string,
  fileId: PropTypes.string
}

export default HarvestItem
