import PropTypes from 'prop-types'
import Router from 'next/router'

import Button from '@codegouvfr/react-dsfr/Button'
import Badge from '@codegouvfr/react-dsfr/Badge'

import Tooltip from '../tooltip'
import {formatDate} from '@/lib/util/date'

import {getFile} from '@/lib/api-moissonneur-bal'

const StatusBadge = ({status, error}) => {
  if (status === 'active') {
    return <Badge label='En cours…' severity='info' noIcon />
  }

  if (status === 'failed') {
    return (
      <Tooltip text={error}>
        <Badge label='Échec' severity='error' noIcon />
      </Tooltip>
    )
  }

  if (status === 'completed') {
    return <Badge label='Terminé' severity='success' noIcon />
  }
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['completed', 'active', 'failed']),
  error: PropTypes.string
}

const UpdateStatusBadge = ({updateStatus, updateRejectionReason}) => {
  if (updateStatus === 'unchanged') {
    return <Badge label='Aucun changement' severity='info' noIcon />
  }

  if (updateStatus === 'rejected') {
    return (
      <Tooltip text={updateRejectionReason}>
        <Badge label='Rejeté' severity='error' noIcon />
      </Tooltip>
    )
  }

  if (updateStatus === 'updated') {
    return <Badge label='Mis à jour' severity='success' noIcon />
  }
}

UpdateStatusBadge.propTypes = {
  updateStatus: PropTypes.oneOf(['unchanged', 'rejected', 'updated']),
  updateRejectionReason: PropTypes.string
}

const HarvestItem = ({startedAt, finishedAt, status, error, updateStatus, updateRejectionReason, fileId}) => {
  const downloadFile = async () => {
    const file = await getFile(fileId)
    Router.push(file.url)
  }

  return (
    <tr>
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
  startedAt: PropTypes.string.isRequired,
  finishedAt: PropTypes.string,
  status: PropTypes.string,
  error: PropTypes.string,
  updateStatus: PropTypes.string,
  updateRejectionReason: PropTypes.string,
  fileId: PropTypes.string
}

export default HarvestItem
