import PropTypes from 'prop-types'
import Router from 'next/router'
import Tooltip from '../tooltip'

import {getFile} from '@/lib/api-moissonneur-bal'
import {getCommune} from '@/lib/cog'

const RevisionPublication = ({status, errorMessage}) => {
  if (status === 'provided-by-other-client') {
    return <p className='fr-badge fr-badge--info'>Publiée par un autre client</p>
  }

  if (status === 'provided-by-other-source') {
    return <p className='fr-badge fr-badge--error'>Publiée par une autre source</p>
  }

  if (status === 'published') {
    return <p className='fr-badge fr-badge--success'>Publiée</p>
  }

  if (status === 'error') {
    return (
      <Tooltip text={errorMessage}>
        <p className='fr-badge fr-badge--error'>Erreur</p>
      </Tooltip>
    )
  }
}

RevisionPublication.propTypes = {
  status: PropTypes.oneOf([
    'provided-by-other-client',
    'provided-by-other-source',
    'published',
    'error'
  ]).isRequired,
  errorMessage: PropTypes.string
}

const RevisionItem = ({codeCommune, fileId, nbRows, nbRowsWithErrors, publication}) => {
  const commune = getCommune(codeCommune)

  const downloadFile = async () => {
    const file = await getFile(fileId)
    Router.push(file.url)
  }

  return (
    <tr>
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
        <RevisionPublication {...publication} />
      </td>
      <td className='fr-col fr-my-1v'>
        {fileId && (
          <button
            type='button'
            className='fr-btn fr-icon-download-fill fr-btn--icon-right'
            onClick={downloadFile}
          >
            Télécharger
          </button>
        )}
      </td>
    </tr>
  )
}

RevisionItem.propTypes = {
  codeCommune: PropTypes.string.isRequired,
  nbRows: PropTypes.number.isRequired,
  nbRowsWithErrors: PropTypes.number.isRequired,
  publication: PropTypes.object.isRequired,
  fileId: PropTypes.string
}

export default RevisionItem
