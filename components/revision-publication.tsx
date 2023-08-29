import {Badge} from '@codegouvfr/react-dsfr/Badge'

import type {PublicationMoissoneur} from '../types/moissoneur'
import Tooltip from './tooltip'

export const RevisionPublication = ({status, errorMessage, currentSourceId, currentClientId}: PublicationMoissoneur) => {
  if (status === 'provided-by-other-client') {
    return (
      <Tooltip text={currentClientId || 'inconnu'}>
        <Badge severity='warning' noIcon>Publiée par un autre client</Badge>
      </Tooltip>
    )
  }

  if (status === 'provided-by-other-source') {
    return (
      <Tooltip text={currentSourceId || 'inconnue'}>
        <Badge severity='error' noIcon>Publiée par une autre source</Badge>
      </Tooltip>
    )
  }

  if (status === 'published') {
    return <Badge severity='success' noIcon>Publiée</Badge>
  }

  if (status === 'error') {
    return (
      <Tooltip text={errorMessage}>
        <Badge severity='error' noIcon>Erreur</Badge>
      </Tooltip>
    )
  }

  return (
    <Badge noIcon>Non publiée</Badge>
  )
}
