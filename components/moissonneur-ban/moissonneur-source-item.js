import Link from 'next/link'
import PropTypes from 'prop-types'
import Link from 'next/link'

import {formatDate} from '@/lib/util/date'

const MoissoneurSourceItem = ({_id, title, model, type, _updated}) => (
  <tr cursor='pointer'>
    <td className='fr-col fr-my-1v'>
      <Link href={`/moissonneur-bal/sources/${_id}`}>
        <a>{title}</a>
      </Link>
    </td>
    <td className='fr-col fr-my-1v'>
      {model}
    </td>
    <td className='fr-col fr-my-1v'>
      {type}
    </td>
    <td className='fr-col fr-my-1v'>
      {_updated ? formatDate(_updated) : 'inconnu'}
    </td>
    <td className='fr-col fr-my-1v'>
      <Link href={{
        pathname: '/moissonneur-bal/sources',
        query: {sourceId: _id}
      }}
      >
        <button className='fr-btn fr-icon-arrow-right-line' type='button' />
      </Link>
    </td>
  </tr>
)

MoissoneurSourceItem.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  model: PropTypes.oneOf(['bal', 'custom']).isRequired,
  type: PropTypes.string.isRequired,
  _updated: PropTypes.string
}

export default MoissoneurSourceItem
