import React from 'react'
import {toast} from 'react-toastify'

import {useRouter} from 'next/router'
import type {PartenaireDeLaCharteCommuneType, PartenaireDeLaCharteOrganismeType, PartenaireDeLaCharteEntrepriseType} from 'types/partenaire-de-la-charte'
import {useUser} from '../../hooks/user'

import Main from '../../layouts/main'
import Loader from '../../components/loader'
import {PartenaireForm} from '@/components/partenaires-de-la-charte/partenaire-form'
import {createPartenaireDeLaCharte} from '@/lib/partenaires-de-la-charte'

const NewPartenaireDeLaChartePage = () => {
  const [isAdmin, isLoading] = useUser()
  const router = useRouter()

  const onCreate = async (formData: Partial<PartenaireDeLaCharteCommuneType | PartenaireDeLaCharteOrganismeType | PartenaireDeLaCharteEntrepriseType>) => {
    try {
      const newPartenaire = await createPartenaireDeLaCharte(formData)
      toast('Partenaire créé', {type: 'success'})
      await router.push(`/partenaires-de-la-charte/${newPartenaire._id}`)
    } catch (error: unknown) {
      console.log(error)
      toast('Erreur lors de la création du partenaire', {type: 'error'})
    }
  }

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container'>
            <PartenaireForm
              title={<h3>Création d&apos;un nouveau partenaire</h3>}
              onSubmit={onCreate}
              submitLabel='Créer le partenaire'
              isCreation />
          </div>
        )}
      </Loader>
    </Main>
  )
}

export default NewPartenaireDeLaChartePage
