import {useEffect, useState} from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import Input from '@codegouvfr/react-dsfr/Input'
import ToggleSwitch from '@codegouvfr/react-dsfr/ToggleSwitch'

import {checkEmail} from '@/lib/util/email'

import { ChefDeFileApiDepotType, PerimeterType } from 'types/api-depot'
import { createChefDeFile, updateChefDeFile } from '@/lib/api-depot'
import PerimeterList from '@/components/api-depot/client/client-form/perimeter-list'

interface ChefDeFileFormProps {
  initialChefDeFile: ChefDeFileApiDepotType;
  isDemo: boolean;
  close: () => void;
}

const ChefDeFileForm = ({initialChefDeFile, isDemo, close}: ChefDeFileFormProps) => {
  const [nom, setNom] = useState<string>(initialChefDeFile ? initialChefDeFile.nom : '')
  const [email, setEmail] = useState<string>(initialChefDeFile ? initialChefDeFile.email : '')
  const [isEmailPublic, setIsEmailPublic] = useState<boolean>(initialChefDeFile ? initialChefDeFile.isEmailPublic : true)
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
  const [perimeters, setPerimeters] = useState<PerimeterType[]>(initialChefDeFile ? initialChefDeFile.perimetre : [])
  const [isSignataireCharte, setIsSignataireCharte] = useState<boolean>(initialChefDeFile ? initialChefDeFile.signataireCharte : false)

  const saveChefDeFile = async event => {
    event.preventDefault()
    try {
      const chefDeFile = {
        nom,
        email,
        isEmailPublic,
        perimetre: perimeters,
        signataireCharte: isSignataireCharte
      }
      if (initialChefDeFile?._id) {
        await updateChefDeFile(initialChefDeFile._id, chefDeFile, isDemo)
      } else {
        await createChefDeFile(chefDeFile, isDemo)
      }
      close()
    } catch (error: unknown) {
      console.error(error)
    }
  }

  const closePreventDefault = event => {
    event.preventDefault();
    close();
  }

  const handleEditNom = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setNom(value)
  };

  const handleEditEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setEmail(value)
  };

  useEffect(() => {
    if (email) {
      const isValid = checkEmail(email)
      setIsEmailValid(isValid)
    } else {
      setIsEmailValid(null)
    }
  }, [email])

  return (
    <div className='fr-my-4w'>
      <div onSubmit={saveChefDeFile}>
        <label className='fr-label'>Chef de file</label>

        <ToggleSwitch
          label='Signataire de la charte'
          checked={isSignataireCharte}
          helperText='Le chef de file a signé la charte'
          onChange={setIsSignataireCharte}
        />

        <div className='fr-grid-row fr-grid-row--gutters'>
          <div className='fr-col-4'>
            <Input
              label='Nom'
              nativeInputProps={{
                required: true,
                value: nom,
                onChange: handleEditNom,
              }}
            />
          </div>
          <div className='fr-col-4'>
            <Input
              label='Email'
              nativeInputProps={{
                required: true,
                value: email,
                onChange: handleEditEmail,
              }}
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

        <PerimeterList perimeters={perimeters} handlePerimeter={setPerimeters} />

        <div className='fr-my-4w fr-grid-row'>
          <Button priority='primary' onClick={e => saveChefDeFile(e)}>
            Enregistrer
          </Button>
          <Button priority='secondary' onClick={e => closePreventDefault(e)}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChefDeFileForm
