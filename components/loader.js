import PropTypes from 'prop-types'

const Loader = ({isLoading, children}) => {
  if (isLoading) {
    return <div>Chargement…</div>
  }

  return children
}

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

export default Loader
