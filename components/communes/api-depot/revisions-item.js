import PropTypes from 'prop-types'
import Link from 'next/link'
import Badge from '@codegouvfr/react-dsfr/Badge'

import {formatDate} from '@/lib/util/date'
import MongoId from '@/components/mongo-id'
import Tooltip from '@/components/tooltip'

const RevisionItem = ({_id, status, current, client, validation, createdAt, publishedAt}) => (
  <tr>
    <td className='fr-col fr-my-1v'>
      <MongoId id={_id} />
    </td>
    <td className='fr-col fr-my-1v'>
      <Tooltip text={client.nom}>
        <Link passHref href={{pathname: '/api-depot/client', query: {clientId: client._id}}}>
          {client._id}
        </Link>
      </Tooltip>
    </td>
    <td className='fr-col fr-my-1v'>
      <Badge severity={status === 'published' ? 'success' : 'warning'} noIcon>{status}</Badge>
    </td>
    <td className='fr-col fr-my-1v'>
      <input type='checkbox' id='checkbox' name='checkbox' checked={current} disabled />
    </td>
    <td className='fr-col fr-my-1v'>
      {validation.valid ? (
        <input type='checkbox' id='checkbox' name='checkbox' checked disabled />
      ) : (
        <Tooltip text={validation.errors.join(',')}>
          <input type='checkbox' id='checkbox' name='checkbox' disabled />
        </Tooltip>
      )}
    </td>
    <td className='fr-col fr-my-1v'>
      {createdAt ? formatDate(createdAt) : 'inconnu'}
    </td>
    <td className='fr-col fr-my-1v'>
      {publishedAt ? formatDate(publishedAt) : 'inconnu'}
    </td>
  </tr>
)

RevisionItem.defaultProps = {
  publishedAt: '',
  current: false,
}

RevisionItem.propTypes = {
  _id: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  current: PropTypes.bool,
  validation: PropTypes.object.isRequired,
  createdAt: PropTypes.string.isRequired,
  publishedAt: PropTypes.string,
}

export default RevisionItem
