import PropTypes from 'prop-types'

const Loader = ({isLoading, children}) => {
  if (isLoading) {
    return <div>Chargementâ€¦</div>
  }

  return children
}

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

export default Loader
