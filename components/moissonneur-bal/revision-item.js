import PropTypes from 'prop-types'
import Router from 'next/router'

import Button from '@codegouvfr/react-dsfr/Button'
import Badge from '@codegouvfr/react-dsfr/Badge'

import Tooltip from '../tooltip'

import {getFile} from '@/lib/api-moissonneur-bal'
import {getCommune} from '@/lib/cog'

const RevisionPublication = ({status, errorMessage}) => {
  if (status === 'provided-by-other-client') {
    return <Badge severity='info' noIcon>Publiée par un autre client</Badge>
  }

  if (status === 'provided-by-other-source') {
    return <Badge severity='error' noIcon>Publiée par une autre source</Badge>
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

RevisionItem.propTypes = {
  codeCommune: PropTypes.string.isRequired,
  nbRows: PropTypes.number.isRequired,
  nbRowsWithErrors: PropTypes.number.isRequired,
  publication: PropTypes.object.isRequired,
  fileId: PropTypes.string
}

export default RevisionItem
