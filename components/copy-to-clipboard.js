import {useState} from 'react'
import PropTypes from 'prop-types'
import Button from '@codegouvfr/react-dsfr/Button'

const CopyToClipBoard = ({text, title}) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <>
      <div className='fr-input-group copy-to-clip-board-container'>
        { title && <label className='fr-label' htmlFor={`input-${title}`}>
          <strong>{title}</strong>
        </label>}
        <input
          className='fr-input'
          name={title ? `input-${title}` : ''}
          value={text}
          readOnly
        />

        <Button iconId={isCopied ? 'fr-icon-check-line' : 'fr-icon-clipboard-line'} onClick={copyToClipboard} />
      </div>
      <style jsx>{`
        .copy-to-clip-board-container {
          display: flex;
          width: 300px;
          align-items: end;
        }

        label {
          margin-right: 10px;
        }
      `}</style>

    </>
  )
}

CopyToClipBoard.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default CopyToClipBoard
