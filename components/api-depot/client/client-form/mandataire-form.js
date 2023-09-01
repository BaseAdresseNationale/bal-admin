import {useEffect, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import Button from '@codegouvfr/react-dsfr/Button'
import Input from '@codegouvfr/react-dsfr/Input'

import {checkEmail} from '@/lib/util/email'

import SelectInput from '@/components/select-input'

const MandataireForm = ({selectedMandataire, mandataires, onSelect}) => {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState()
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

  const mandatairesOptions = useMemo(() =>
    mandataires.sort((a, b) => a.nom > b.nom).map(m => ({label: m.nom + ' (' + m.email + ')', value: m._id}))
  , [mandataires])

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
    if (nom && email && isEmailValid) {
      onSelect({nom, email})
    }
  }, [nom, email, isEmailValid])

  return (
    <div className='fr-my-4w'>
      {isCreateFormOpen ? (
        <div>
          <label className='fr-label'>Mandataire</label>

          <div className='fr-grid-row fr-grid-row--gutters'>
            <div className='fr-col-6'>
              <Input label='Nom' value={nom} onChange={e => setNom(e.target.value)} />
            </div>
            <div className='fr-col-6'>
              <Input
                label='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                state={isEmailValid === false ? 'error' : 'default'}
                stateRelatedMessage='L’email n’est pas valide'
              />
            </div>
          </div>

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
              label='Mandataire'
              hint='Mandataire gestionnaire du client'
              value={selectedMandataire}
              defaultOption='Sélectionner un mandataire'
              options={mandatairesOptions}
              handleChange={onSelect}
            />
          </div>
          <div className='fr-col-sm-12 fr-col-md-4'>
            <Button iconId='fr-icon-add-line' onClick={e => handleCreationForm(e, true)}>
              Nouveau mandataire
            </Button>
          </div>
        </div>

      )}
    </div>
  )
}

MandataireForm.defaultProps = {
  mandataires: []
}

MandataireForm.propTypes = {
  selectedMandataire: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  mandataires: PropTypes.array,
  onSelect: PropTypes.func.isRequired
}

export default MandataireForm
