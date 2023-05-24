import PropTypes from 'prop-types'

import Badge from '@codegouvfr/react-dsfr/Badge'

import Tooltip from './tooltip'

const UpdateStatusBadge = ({updateStatus, updateRejectionReason}) => {
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
  updateRejectionReason: PropTypes.string
}

export default UpdateStatusBadge
