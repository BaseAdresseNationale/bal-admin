import {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import Button from '@codegouvfr/react-dsfr/Button'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Router from 'next/router'
import Main from '@/layouts/main'

import {useUser} from '@/hooks/user'

import Loader from '@/components/loader'
import {createClient, createMandataire, createChefDeFile, getChefsDeFile, getClients, getMandataires} from '@/lib/api-depot'
import TextInput from '@/components/text-input'
import ToggleInput from '@/components/toggle-input'
import SelectInput from '@/components/select-input'
import MandataireForm from '@/components/api-depot/client/client-form/mandataire-form'
import ChefDeFileForm from '@/components/api-depot/client/client-form/chef-de-file-form'

const authorizationStrategyOptions = [
  {label: 'Chef de file', value: 'chef-de-file'},
  {label: 'Habilitation', value: 'habilitation'},
  {label: 'Interne', value: 'internal'}
]

const ClientForm = ({client, mandataires, chefsDeFile}) => {
  const [isAdmin, isLoading] = useUser()

  const [nom, setNom] = useState(client.nom || '')
  const [isModeRelax, setIsModeRelax] = useState(Boolean(client.options?.relaxMode))
  const [isActive, setIsActive] = useState(client.active || false)
  const [authorizationStrategy, setAuthorizationStrategy] = useState(client.authorizationStrategy || 'chef-de-file')
  const [mandataire, setMandataire] = useState(client.mandataire || '')
  const [chefDeFile, setChefDeFile] = useState(client.chefDeFile || '')
  const [isFormValid, setIsFormValid] = useState(false)
  const [submitError, setSubmitError] = useState()

  const handleSumit = useCallback(async event => {
    event.preventDefault()

    const body = {
      nom,
      options: {relaxMode: isModeRelax},
      active: isActive,
      authorizationStrategy
    }

    try {
      // Gestion du mandataire sélectionné ou créé
      if (typeof mandataire === 'object') {
        const newMandataire = await createMandataire(mandataire)
        body.mandataire = newMandataire._id
      } else {
        body.mandataire = mandataire
      }

      // Gestion du chef de file sélectionné ou créé
      if (typeof chefDeFile === 'object') {
        const newChefDeFile = await createChefDeFile(chefDeFile)
        body.chefDeFile = newChefDeFile._id
      } else if (chefDeFile) {
        body.chefDeFile = chefDeFile
      }

      const {_id} = await createClient(body)
      Router.push({pathname: '/api-depot/client', query: {clientId: _id}})
    } catch (error) {
      setSubmitError(error.message || '')
    }
  }, [nom, isModeRelax, isActive, authorizationStrategy, mandataire, chefDeFile])

  useEffect(() => {
    setIsFormValid(nom && mandataire)
  }, [nom, mandataire])

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container fr-my-4w'>
            <form onSubmit={handleSumit}>
              <TextInput
                label='Nom'
                value={nom}
                hint='Nom du client. Exemple : Business Geografic'
                handleChange={setNom}
              />

              <ToggleInput
                label='Activé'
                hint='Authorise le client à utiliser l’API'
                isCheck={isActive}
                handleChange={setIsActive}
              />

              <ToggleInput
                label='Mode relax'
                hint='Le mode relax assoupli les vérifications du Validateur BAL'
                isCheck={isModeRelax}
                handleChange={setIsModeRelax}
              />

              <SelectInput
                label='Stratégie d’authorisation'
                hint='Méthode qui authorise le client à publier des BAL'
                value={authorizationStrategy}
                options={authorizationStrategyOptions}
                handleChange={setAuthorizationStrategy}
              />

              <MandataireForm
                selectedMandataire={mandataire}
                mandataires={mandataires}
                onSelect={setMandataire}
              />

              <ChefDeFileForm
                selectChefDeFile={chefDeFile}
                chefsDeFile={chefsDeFile}
                onSelect={setChefDeFile}
              />

              <Button
                type='submit'
                iconId='fr-icon-save-line'
                disabled={!isFormValid}
              >
                Enregistrer
              </Button>
            </form>

            {submitError && (
              <Alert
                className='fr-mt-2w'
                severity='error'
                title='Impossible d’enregistrer'
                description={submitError}
              />
            )}
          </div>
        )}
      </Loader>
    </Main>
  )
}

ClientForm.defaultProps = {
  client: null
}

ClientForm.propTypes = {
  client: PropTypes.shape({
    nom: PropTypes.string,
    options: PropTypes.shape({
      relaxMode: PropTypes.bool
    }),
    active: PropTypes.bool,
    authorizationStrategy: PropTypes.oneOf(['habilitation', 'chef-de-file', 'internal']),
    mandataire: PropTypes.string,
    chefDeFile: PropTypes.string
  }),
  mandataires: PropTypes.array.isRequired,
  chefsDeFile: PropTypes.array.isRequired
}

export async function getServerSideProps({query}) {
  let client = {}

  const mandataires = await getMandataires()
  const chefsDeFile = await getChefsDeFile()

  if (query.clientId) {
    client = await getClients(query.baseLocaleId)
  }

  return {
    props: {
      client,
      mandataires,
      chefsDeFile
    }
  }
}

export default ClientForm
