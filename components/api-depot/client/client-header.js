import PropTypes from 'prop-types'

import CopyToClipBoard from '@/components/copy-to-clipboard'

const ClientHeader = ({id, nom, token}) => (
  <div className='fr-py-4v'>
    <h1 className='fr-m-1v' >Client</h1>
    <div className='fr-container fr-py-4v'>
      <div className='fr-grid-row fr-grid-row--gutters'>
        <div className='fr-col-10'>
          <h2>{nom}</h2>
          <CopyToClipBoard text={id} title='Id' />
          <CopyToClipBoard text={token} title='Token' />
        </div>
      </div>
    </div>
  </div>
)

ClientHeader.propTypes = {
  id: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
}

export default ClientHeader
