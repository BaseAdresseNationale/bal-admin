import {useEffect, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash'
import Button from '@codegouvfr/react-dsfr/Button'
import Input from '@codegouvfr/react-dsfr/Input'
import ToggleSwitch from '@codegouvfr/react-dsfr/ToggleSwitch'

import {checkEmail} from '@/lib/util/email'

import SelectInput from '@/components/select-input'
import ChefDeFilePerimeter from '@/components/api-depot/client/client-form/chef-de-file-perimeter'

const ChefDeFileForm = ({selectedChefDeFile, chefsDeFile, onSelect}) => {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [isEmailPublic, setIsEmailPublic] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState()
  const [perimeters, setPerimeters] = useState([{type: 'epci', code: '', key: uniqueId('perimeter_')}])
  const [isSignataireCharte, setIsSignataireCharte] = useState(true)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

  const chefsDeFileOptions = useMemo(() =>
    chefsDeFile.sort((a, b) => a.nom > b.nom).map(m => ({label: m.nom + ' (' + m.email + ')', value: m._id}))
  , [chefsDeFile])

  const handleCreationForm = (event, isOpen) => {
    event.preventDefault()
    setIsCreateFormOpen(isOpen)
    onSelect('')
  }

  useEffect(() => {
    if (email) {
      const isValid = checkEmail(email)
      setIsEmailValid(isValid)
    } else {
      setIsEmailValid(null)
    }
  }, [email])

  useEffect(() => {
    if (nom && email && isEmailValid
        && perimeters.every(({code}) => code.length > 0)
    ) {
      onSelect({
        nom,
        email,
        isEmailPublic,
        perimetre: perimeters.map(({type, code}) => `${type}-${code}`),
        signataireCharte: isSignataireCharte
      })
    }
  }, [nom, email, isEmailPublic, isEmailValid, perimeters, isSignataireCharte])

  return (
    <div className='fr-my-4w'>
      {isCreateFormOpen ? (
        <div>
          <label className='fr-label'>Chef de file</label>

          <ToggleSwitch
            label='Signataire de la charte'
            checked={isSignataireCharte}
            helperText='Le chef de file a signé la charte'
            onChange={setIsSignataireCharte}
          />

          <div className='fr-grid-row fr-grid-row--gutters'>
            <div className='fr-col-4'>
              <Input label='Nom' value={nom} onChange={e => setNom(e.target.value)} />
            </div>
            <div className='fr-col-4'>
              <Input
                label='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                state={isEmailValid === false ? 'error' : 'default'}
                stateRelatedMessage='L’email n’est pas valide'
              />
            </div>
            <div className='fr-col-4'>
              <ToggleSwitch
                label='Email public'
                checked={isEmailPublic}
                onChange={setIsEmailPublic}
              />
            </div>
          </div>

          <ChefDeFilePerimeter perimeters={perimeters} handlePerimeter={setPerimeters} />

          <div className='fr-grid-row fr-grid-row--gutters'>
            <div className='fr-col'>
              <Button priority='secondary' onClick={e => handleCreationForm(e, false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--bottom'>
          <div className='fr-col-sm-12 fr-col-md-8'>
            <SelectInput
              label='Chef de file'
              hint='Chef de file du client'
              value={selectedChefDeFile}
              defaultOption='Aucun'
              options={chefsDeFileOptions}
              handleChange={onSelect}
            />
          </div>
          <div className='fr-col-sm-12 fr-col-md-4'>
            <Button iconId='fr-icon-add-line' onClick={e => handleCreationForm(e, true)}>
              Nouveau chef de file
            </Button>
          </div>
        </div>

      )}
    </div>
  )
}

ChefDeFileForm.defaultProps = {
  chefsDeFile: []
}

ChefDeFileForm.propTypes = {
  selectedChefDeFile: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  chefsDeFile: PropTypes.array,
  onSelect: PropTypes.func.isRequired
}

export default ChefDeFileForm
