import {useEffect, useState} from 'react'
import {uniqueId} from 'lodash'
import PropTypes from 'prop-types'
import epcis from '@etalab/decoupage-administratif/data/epci.json'
import departements from '@etalab/decoupage-administratif/data/departements.json'
import allCommunes from '@etalab/decoupage-administratif/data/communes.json'

import AutocompleteInput from '@/components/autocomplete-input'
import SelectInput from '@/components/select-input'

const typeOptions = [
  {label: 'EPCI', value: 'epci'},
  {label: 'Département', value: 'departement'},
  {label: 'Commune', value: 'commune'}
]

const Perimeter = ({type, code, handlePerimeter}) => {
  const [perimetreOptions, setPerimetreOptions] = useState([])

  useEffect(() => {
    let options = []
    if (type === 'epci') {
      options = epcis.map(({code, nom}) => ({value: code, label: nom}))
    } else if (type === 'departement') {
      options = departements.map(({code, nom}) => ({value: code, label: nom}))
    } else if (type === 'commune') {
      options = allCommunes
        .filter(c => ['commune-actuelle', 'arrondissement-municipal'].includes(c.type))
        .map(({code, nom}) => ({value: code, label: nom}))
    }

    setPerimetreOptions(options)
  }, [type])

  return (
    <div className='fr-grid-row fr-grid-row--gutters'>
      <div className='fr-col-6'>
        <SelectInput
          label='Type'
          value={type}
          options={typeOptions}
          handleChange={v => handlePerimeter({type: v, code})}
        />
      </div>

      <div className='fr-col-6'>
        <AutocompleteInput
          id={uniqueId()}
          label='Code'
          options={perimetreOptions}
          value={code}
          onChange={e => handlePerimeter({type, code: e.target.value})}
        />
      </div>
    </div>
  )
}

Perimeter.propTypes = {
  type: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  handlePerimeter: PropTypes.func.isRequired
}

export default Perimeter
