import PropTypes from 'prop-types'

import {Badge} from '@codegouvfr/react-dsfr/Badge'

import type {UpdateStatusEnum} from '../types/moissoneur'
import Tooltip from './tooltip'

type UpdateStatusBadgeProps = {
  updateStatus: UpdateStatusEnum;
  updateRejectionReason?: string;
}

const UpdateStatusBadge = ({updateStatus, updateRejectionReason}: UpdateStatusBadgeProps) => {
  if (updateStatus === 'unchanged') {
    return <Badge severity='info' noIcon>Aucun changement</Badge>
  }

  if (updateStatus === 'rejected') {
    return (
      <Tooltip text={updateRejectionReason}>
        <Badge severity='error' noIcon>Rejeté</Badge>
      </Tooltip>
    )
  }

  if (updateStatus === 'updated') {
    return <Badge severity='success' noIcon>Mis à jour</Badge>
  }
}

UpdateStatusBadge.propTypes = {
  updateStatus: PropTypes.oneOf(['unchanged', 'rejected', 'updated']),
  updateRejectionReason: PropTypes.string,
}

export default UpdateStatusBadge
