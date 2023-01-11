import PropTypes from 'prop-types'

import {getEPCI, getDepartement, getCommune} from '@/lib/cog'

function getPerimeters(perimetre) {
  return perimetre ? perimetre.map(p => {
    const [territoireType, code] = p.split('-')

    if (territoireType === 'epci') {
      return `EPCI de ${getEPCI(code).nom}`
    }

    if (territoireType === 'departement') {
      return `Département de ${getDepartement(code).nom}`
    }

    if (territoireType === 'commune') {
      return `Commune de ${getCommune(code).nom}`
    }

    return 'inconnu'
  }) : null
}

const ChefDeFile = ({nom, email, perimetre, signataireCharte}) => {
  const perimeters = getPerimeters(perimetre)
  return (
    <div className='fr-container'>
      <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--middle'>
        <div className='fr-col-10'>
          <h3>{nom}</h3>
        </div>

        <div className='fr-col'>
          <a href={`emailTo:${email}`}>{email}</a>
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
  )
}

ChefDeFile.propTypes = {
  nom: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  perimetre: PropTypes.string.isRequired,
  signataireCharte: PropTypes.bool.isRequired
}

export default ChefDeFile
