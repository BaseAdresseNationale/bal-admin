import {useEffect, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash'
import Button from '@codegouvfr/react-dsfr/Button'
import Input from '@codegouvfr/react-dsfr/Input'
import ToggleSwitch from '@codegouvfr/react-dsfr/ToggleSwitch'

import SelectInput from '@/components/select-input'
import { ChefDeFileApiDepotType } from 'types/api-depot'

interface ChefDeFileSelectProps {
  selectedChefDeFile: string;
  chefsDeFile: ChefDeFileApiDepotType[];
  onSelect: (value: any) => void;
}



const ChefDeFileSelect = ({selectedChefDeFile, chefsDeFile, onSelect}: ChefDeFileSelectProps) => {
  const chefsDeFileOptions = useMemo(() =>
    chefsDeFile.map(m => ({label: m.nom + ' (' + m.email + ')', value: m._id}))
  , [chefsDeFile])

  return (
    <div className='fr-my-4w'>
      <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--bottom'>
        <div className='fr-col-sm-12 fr-col-md-4'>
          <SelectInput
            label='Chef de file'
            hint='Chef de file du client'
            value={selectedChefDeFile}
            defaultOption='Aucun'
            options={chefsDeFileOptions}
            handleChange={onSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default ChefDeFileSelect
