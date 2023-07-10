import PropTypes from 'prop-types'

import CopyToClipBoard from '@/components/copy-to-clipboard'

const Mandataire = ({_id, nom, email}) => (
  <div className='fr-py-4v'>
    <h1 className='fr-m-1v'>Mandataire</h1>
    <div className='fr-container fr-py-4v'>
      <div className='fr-grid-row fr-grid-row--gutters'>
        <div className='fr-col'>
          <h3>{nom}</h3>
          <CopyToClipBoard text={_id} title='Id' />
          <CopyToClipBoard text={email} title='Email' />
        </div>
      </div>
    </div>
  </div>
)

Mandataire.propTypes = {
  _id: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
}

export default Mandataire
