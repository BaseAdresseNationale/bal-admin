import PropTypes from 'prop-types'
import Router from 'next/router'

import Button from '@codegouvfr/react-dsfr/Button'
import Badge from '@codegouvfr/react-dsfr/Badge'

import Tooltip from '../tooltip'

import MongoId from '@/components/mongo-id'
import UpdateStatusBadge from '@/components/update-status-badge'

import {getFile} from '@/lib/api-moissonneur-bal'
import {getCommune} from '@/lib/cog'

const RevisionPublication = ({status, errorMessage, currentSourceName, currentClientName}) => {
  if (status === 'provided-by-other-client') {
    return (
      <Tooltip text={currentClientName || 'inconnu'}>
        <Badge severity='warning' noIcon>Publiée par un autre client</Badge>
      </Tooltip>
    )
  }

  if (status === 'provided-by-other-source') {
    return (
      <Tooltip text={currentSourceName || 'inconnue'}>
        <Badge severity='error' noIcon>Publiée par une autre source</Badge>
      </Tooltip>
    )
  }

  if (status === 'published') {
    return <Badge severity='success' noIcon>Publiée</Badge>
  }

  if (status === 'error') {
    return (
      <Tooltip text={errorMessage}>
        <Badge severity='error' noIcon>Erreur</Badge>
      </Tooltip>
    )
  }

  return (
    <Badge noIcon>Non publiée</Badge>
  )
}

RevisionPublication.propTypes = {
  status: PropTypes.oneOf([
    'provided-by-other-client',
    'provided-by-other-source',
    'published',
    'error'
  ]),
  errorMessage: PropTypes.string,
  currentSourceName: PropTypes.string,
  currentClientName: PropTypes.string
}

const RevisionItem = ({_id, codeCommune, fileId, nbRows, nbRowsWithErrors, updateStatus, updateRejectionReason, publication, onForcePublishRevision, isForcePublishRevisionLoading}) => {
  const commune = getCommune(codeCommune)

  const downloadFile = async () => {
    const file = await getFile(fileId)
    Router.push(file.url)
  }

  const displayForcePublishButton = !publication || publication?.status === 'provided-by-other-source' || publication?.status === 'provided-by-other-client'

  return (
    <tr>
      <td className='fr-col fr-my-1v'>
        <MongoId id={_id} />
      </td>
      <td className='fr-col fr-my-1v'>
        <a>{commune.nom} ({codeCommune})</a>
      </td>
      <td className='fr-col fr-my-1v'>
        <a>{nbRows}</a>
      </td>
      <td className='fr-col fr-my-1v'>
        <a>{nbRowsWithErrors}</a>
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
      <td className='fr-col fr-my-1v'>
        {displayForcePublishButton && (
          <Button
            onClick={onForcePublishRevision}
            disabled={isForcePublishRevisionLoading}
          >
            {isForcePublishRevisionLoading ? 'Publication...' : 'Forcer la publication'}
          </Button>
        )}
      </td>
    </tr>
  )
}

RevisionItem.default = {
  publication: null,
  updateRejectionReason: null
}

RevisionItem.propTypes = {
  _id: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  nbRows: PropTypes.number.isRequired,
  nbRowsWithErrors: PropTypes.number.isRequired,
  updateStatus: PropTypes.string.isRequired,
  updateRejectionReason: PropTypes.string,
  publication: PropTypes.object,
  fileId: PropTypes.string,
  onForcePublishRevision: PropTypes.func,
  isForcePublishRevisionLoading: PropTypes.bool
}

export default RevisionItem
