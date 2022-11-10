import PropTypes from 'prop-types'
import Router from 'next/router'
import Tooltip from '../tooltip'
import {formatDate} from '@/lib/util/date'

import {getFile} from '@/lib/api-moissonneur-bal'

const StatusBadge = ({status, error}) => {
  if (status === 'active') {
    return <p className='fr-badge fr-badge--info'>En cours…</p>
  }

  if (status === 'failed') {
    return (
      <Tooltip text={error}>
        <p className='fr-badge fr-badge--error'>Échec</p>
      </Tooltip>
    )
  }

  if (status === 'completed') {
    return <p className='fr-badge fr-badge--success'>Terminé</p>
  }
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['completed', 'active', 'failed']),
  error: PropTypes.string
}

const UpdateStatusBadge = ({updateStatus, updateRejectionReason}) => {
  if (updateStatus === 'unchanged') {
    return <p className='fr-badge fr-badge--info'>Aucun changement</p>
  }

  if (updateStatus === 'rejected') {
    return (
      <Tooltip text={updateRejectionReason}>
        <p className='fr-badge fr-badge--error'>Rejeté</p>
      </Tooltip>
    )
  }

  if (updateStatus === 'updated') {
    return <p className='fr-badge fr-badge--success'>Mis à jour</p>
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
          <button
            type='button'
            className='fr-btn fr-icon-download-line fr-btn--icon-right'
            onClick={downloadFile}
          >
            Télécharger
          </button>
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
