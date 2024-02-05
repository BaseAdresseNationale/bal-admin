import {Badge} from '@codegouvfr/react-dsfr/Badge'

import {UpdateStatusEnum} from '../types/moissoneur'
import Tooltip from './tooltip'

type UpdateStatusBadgeProps = {
  updateStatus: UpdateStatusEnum;
  updateRejectionReason?: string;
}

const UpdateStatusBadge = ({updateStatus, updateRejectionReason}: UpdateStatusBadgeProps) => {
  if (updateStatus === UpdateStatusEnum.UNCHANGED) {
    return <Badge severity='info' noIcon>Aucun changement</Badge>
  }

  if (updateStatus === UpdateStatusEnum.REJECTED) {
    return (
      <Tooltip text={updateRejectionReason} width='200px'>
        <Badge severity='error' noIcon>Rejeté</Badge>
      </Tooltip>
    )
  }

  if (updateStatus === UpdateStatusEnum.UPDATED) {
    return <Badge severity='success' noIcon>Mis à jour</Badge>
  }
}

export default UpdateStatusBadge
