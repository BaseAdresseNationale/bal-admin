import {useCallback} from 'react'
import PropTypes from 'prop-types'
import Button from '@codegouvfr/react-dsfr/Button'

import {uniqueId} from 'lodash'
import Perimeter from '@/components/api-depot/client/client-form/perimeter'

const ChefDeFilePerimeter = ({perimeters, handlePerimeter}) => {
  const removePerimeter = useCallback((event, key) => {
    event.preventDefault()
    handlePerimeter(p => [...p.filter(p => p.key !== key)])
  }, [handlePerimeter])

  const handleChange = useCallback((perimeter, key, idx) => {
    const {type, code} = perimeter

    const cpy = [...perimeters]
    cpy[idx] = {type, code, key}

    handlePerimeter(cpy)
  }, [perimeters, handlePerimeter])

  const addPerimeter = event => {
    event.preventDefault()

    const cpy = [...perimeters, {
      type: 'epci', code: '', key: uniqueId('perimeter_')
    }]
    handlePerimeter(cpy)
  }

  return (
    <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--bottom'>
      <div className='fr-col'>
        <label className='fr-label'>Périmètre</label>
        {perimeters.map((p, idx) => (
          <div key={p.key} className='fr-container fr-my-2w fr-grid-row fr-grid-row--gutters fr-grid-row--bottom'>
            <Perimeter
              type={p.type}
              code={p.code}
              handlePerimeter={v => handleChange(v, p.key, idx)}
            />

            {idx !== 0 && (
              <div className='fr-col-1'>
                <Button
                  iconId='fr-icon-delete-bin-line'
                  onClick={e => removePerimeter(e, p.key)}
                  priority='tertiary no outline'
                  title='Remove perimeter'
                />
              </div>
            )}
          </div>
        ))}

        {perimeters.every(({code}) => code.length > 0) && (
          <div className='fr-col'>
            <Button priority='secondary' iconId='fr-icon-add-line' onClick={addPerimeter}>
              Ajouter un périmètre
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

ChefDeFilePerimeter.propTypes = {
  perimeters: PropTypes.array.isRequired,
  handlePerimeter: PropTypes.func.isRequired
}

export default ChefDeFilePerimeter
