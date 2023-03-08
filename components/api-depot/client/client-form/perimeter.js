import PropTypes from 'prop-types'
import Input from '@codegouvfr/react-dsfr/Input'

import SelectInput from '@/components/select-input'

const typeOptions = [
  {label: 'EPCI', value: 'epci'},
  {label: 'Département', value: 'departement'},
  {label: 'Commune', value: 'commune'}
]

const Perimeter = ({type, code, handlePerimeter}) => (
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
      <Input
        label='Code'
        value={code}
        onChange={e => handlePerimeter({type, code: e.target.value})}
      />
    </div>
  </div>
)

Perimeter.propTypes = {
  type: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  handlePerimeter: PropTypes.func.isRequired
}

export default Perimeter
