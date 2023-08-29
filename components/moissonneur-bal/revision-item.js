import PropTypes from 'prop-types'
import Router from 'next/router'
import Link from 'next/link'

import Button from '@codegouvfr/react-dsfr/Button'

import MongoId from '@/components/mongo-id'
import UpdateStatusBadge from '@/components/update-status-badge'

import {getFile} from '@/lib/api-moissonneur-bal'
import {getCommune} from '@/lib/cog'
import {RevisionPublication} from '@/components/revision-publication'

const RevisionItem = ({_id, sourceId, codeCommune, fileId, nbRows, nbRowsWithErrors, updateStatus, updateRejectionReason, publication, onForcePublishRevision, isForcePublishRevisionLoading, ignoreFields}) => {
  const commune = getCommune(codeCommune)

  const downloadFile = async () => {
    const file = await getFile(fileId)
    Router.push(file.url)
  }

  const displayForcePublishButton = !publication || publication?.status === 'provided-by-other-source' || publication?.status === 'provided-by-other-client'
  return (
    <tr>
      {!ignoreFields.includes('id') && <td className='fr-col fr-my-1v'>
        <MongoId id={_id} />
      </td>}
      {!ignoreFields.includes('sourceId') && <td className='fr-col fr-my-1v'>
        <Link passHref href={{pathname: '/moissonneur-bal/sources', query: {sourceId}}}>
          {sourceId}
        </Link>
      </td>}
      {!ignoreFields.includes('commune') && <td className='fr-col fr-my-1v'>
        <a>{commune.nom} ({codeCommune})</a>
      </td>}
      {!ignoreFields.includes('nbRows') && <td className='fr-col fr-my-1v'>
        <a>{nbRows}</a>
      </td>}
      {!ignoreFields.includes('nbRowsWithErrors') && <td className='fr-col fr-my-1v'>
        <a>{nbRowsWithErrors}</a>
      </td>}
      {!ignoreFields.includes('updateStatus') && <td className='fr-col fr-my-1v'>
        <UpdateStatusBadge
          updateStatus={updateStatus}
          updateRejectionReason={updateRejectionReason}
        />
      </td>}
      {!ignoreFields.includes('publication') && <td className='fr-col fr-my-1v'>
        <RevisionPublication {...publication} />
      </td>}
      {!ignoreFields.includes('file') && <td className='fr-col fr-my-1v'>
        {fileId && (
          <Button
            iconId='fr-icon-download-line'
            iconPosition='right'
            onClick={downloadFile}
          >
            Télécharger
          </Button>
        )}
      </td>}
      {!ignoreFields.includes('force') && <td className='fr-col fr-my-1v'>
        {displayForcePublishButton && (
          <Button
            onClick={onForcePublishRevision}
            disabled={isForcePublishRevisionLoading}
          >
            {isForcePublishRevisionLoading ? 'Publication...' : 'Forcer la publication'}
          </Button>
        )}
      </td>}
    </tr>
  )
}

RevisionItem.defaultProps = {
  publication: null,
  updateRejectionReason: null,
  ignoreFields: [],
}

RevisionItem.propTypes = {
  _id: PropTypes.string.isRequired,
  sourceId: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  nbRows: PropTypes.number.isRequired,
  nbRowsWithErrors: PropTypes.number.isRequired,
  updateStatus: PropTypes.string.isRequired,
  updateRejectionReason: PropTypes.string,
  publication: PropTypes.object,
  fileId: PropTypes.string,
  onForcePublishRevision: PropTypes.func,
  isForcePublishRevisionLoading: PropTypes.bool,
  ignoreFields: PropTypes.array
}

export default RevisionItem
