import PropTypes from 'prop-types'

import {getEPCI, getDepartement, getCommune} from '@/lib/cog'

import CopyToClipBoard from '@/components/copy-to-clipboard'

function getPerimeters(perimetre) {
  return perimetre ? perimetre.map(p => {
    const [territoireType, code] = p.split('-')

    if (territoireType === 'epci') {
      return `EPCI de ${getEPCI(code).nom} (${code})`
    }

    if (territoireType === 'departement') {
      return `Département de ${getDepartement(code).nom} (${code})`
    }

    if (territoireType === 'commune') {
      return `Commune de ${getCommune(code).nom} (${code})`
    }

    return 'inconnu'
  }) : null
}

const ChefDeFile = ({hasChefDeFile, _id, nom, email, isEmailPublic, perimetre, signataireCharte}) => {
  const perimeters = getPerimeters(perimetre)
  return (
    <div className='fr-py-4v'>
      <h1 className='fr-m-1v'>Chef de file</h1>
      {hasChefDeFile ? (
        <div className='fr-container fr-py-4v'>
          <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--middle'>
            <div className='fr-col-10'>
              <h3>{nom}</h3>
              <CopyToClipBoard text={_id} title='Id' />
              <CopyToClipBoard text={email} title='Email' />
              <div className='fr-col'>
                <input type='checkbox' id='checkbox' name='checkbox' checked={isEmailPublic} disabled />
                <label className='fr-label' htmlFor='checkbox'>Email Public</label>
              </div>
            </div>

            <div className='fr-col'>
              <input type='checkbox' id='checkbox' name='checkbox' checked={signataireCharte} disabled />
              <label className='fr-label' htmlFor='checkbox'>signataire de la charte</label>
            </div>
          </div>

          <div className='fr-my-2w'>
            <label className='fr-label'>Périmètre :</label>
            <ul>
              {perimeters ? perimeters.map(p => (
                <li key={p}>{p}</li>
              )) : 'Aucune périmètre n’est défini'}
            </ul>
          </div>
        </div>
      ) : (
        <div className='fr-container fr-py-4v'>
          <div className='fr-grid-row fr-grid-row--gutters'>
            <div className='fr-col'>
              Aucun chef de file
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* eslint-disable react/boolean-prop-naming */
ChefDeFile.propTypes = {
  hasChefDeFile: PropTypes.bool,
  _id: PropTypes.string,
  nom: PropTypes.string,
  email: PropTypes.string,
  isEmailPublic: PropTypes.bool,
  perimetre: PropTypes.array,
  signataireCharte: PropTypes.bool
}
/* eslint-enable react/boolean-prop-naming */

export default ChefDeFile
