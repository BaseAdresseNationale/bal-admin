import PropTypes from 'prop-types'

const MongoId = ({id}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(id)
  }

  return (
    <div className='mongo-id-container'>
      <i onClick={copyToClipboard}>{id}</i>
      <style jsx>{`
        .mongo-id-container {
            margin-top: -1em;
        }
        
        i {
            font-size: small;
            cursor: copy;
        }
      `}</style>
    </div>
  )
}

MongoId.propTypes = {
  id: PropTypes.string.isRequired
}

export default MongoId
