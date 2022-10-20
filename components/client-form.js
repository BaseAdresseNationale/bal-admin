import {useState} from 'react'
import propTypes from 'prop-types'
import Link from 'next/link'

const ClientForm = ({client}) => {
  const [nom, setNom] = useState(client.nom || '')
  const [chefDeFile, setChefDeFile] = useState(client.chefDeFile || '')
  const [mandataire, setMandataire] = useState(client.mandataire || '')
  const [authorizationStrategy, setAuthorizationStrategy] = useState(client.authorizationStrategy || '')

  const [isActive, setIsActive] = useState(client.active || 'false')

  async function getEPCISCommunes(nom) {
    const res = await fetch(`https://geo.api.gouv.fr/epcis?nom=${nom}&boost=population&limit=5`)
    const epcis = await res.json()

    const res2 = await fetch(`https://geo.api.gouv.fr/epcis/${epcis[0].code}/communes`)

    const epciCommunes = await res2.json()

    return epciCommunes
  }

  function resetInputs() {
    setNom('')
    setChefDeFile('')
    setMandataire('')
    setAuthorizationStrategy('')
    setIsActive('false')
  }

  const handleAddClient = event => {
    event.preventDefault()
    if (nom && chefDeFile && mandataire && authorizationStrategy) {
      const user = {
        nom,
        chefDeFile,
        mandataire,
        authorizationStrategy,
        isActive
      }

      console.log(user)
      resetInputs()
    }
  }

  // getEPCISCommunes('nancy')

  return (
    <div className='fr-container'>
      <h2 className='fr-mt-2w'>Ajouter un client :</h2>
      <form onSubmit={handleAddClient}>
        <div className='fr-grid-row center'>
          <div className='fr-input-group fr-col-11 fr-col-md-5 fr-m-1w'>
            <label className='fr-label' htmlFor='text-input-text'>Nom</label>
            <input
              className='fr-input'
              required
              type='text'
              id='nom'
              name='nom'
              value={nom}
              onChange={e => setNom(e.target.value)}
            />
          </div>

          <div className='fr-input-group fr-col-11 fr-col-md-5 fr-m-1w'>
            <label className='fr-label' htmlFor='text-input-text'>Chef de file</label>
            <input
              className='fr-input'
              required
              type='text'
              id='chefDeFile'
              name='chefDeFile'
              value={chefDeFile}
              onChange={e => setChefDeFile(e.target.value)}
            />
          </div>
        </div>

        <div className='fr-grid-row center'>
          <div className='fr-input-group fr-col-11 fr-col-md-5 fr-m-1w'>
            <label className='fr-label' htmlFor='text-input-text'>Mandataire</label>
            <input
              className='fr-input fr-col'
              required
              type='text'
              id='mandataire'
              name='mandataire'
              value={mandataire}
              onChange={e => setMandataire(e.target.value)}
            />
          </div>

          <div className='fr-select-group fr-col-11 fr-col-md-5 fr-m-1w'>
            <label className='fr-label' htmlFor='select'>
              Authentification
            </label>
            <select
              className='fr-select'
              id='authorizationStrategy'
              name='authorizationStrategy'
              required
              value={authorizationStrategy}
              onChange={e => setAuthorizationStrategy(e.target.value)}
            >
              <option
                value=''
                disabled
                hidden
              >
                Choisir un type d’authentification
              </option>
              <option
                value='chef-de-file'
              >
                Chef de file
              </option>
              <option
                value='habilitation'
              >
                Habilitation
              </option>
            </select>
          </div>

          <div className='fr-checkbox-group fr-col-11 fr-col-md-5 fr-m-1w fr-p-4v'>
            <input
              type='checkbox'
              id='checkbox'
              name='checkbox'
              checked={isActive === 'true'}
              onChange={() => setIsActive(isActive === 'true' ? 'false' : 'true')}
            />
            <label className='fr-label' htmlFor='checkbox'>Actif ?</label>
          </div>
        </div>

        <div className='fr-container fr-pt-3w'>
          <div className='fr-btn-group end'>
            <input
              type='submit'
              value='Ajouter'
              className='fr-btn fr-m-1w'
            />
            <Link href='/'>
              <button
                type='button'
                className='fr-btn fr-btn--secondary fr-m-1w'
              >
                Annuler
              </button>
            </Link>
          </div>
        </div>
      </form>
      <style jsx>{`
        .center {
          display: flex;
          justify-content: center;
        }

        .end {
          display: flex;
          justify-content: end;
        }
      `}</style>
    </div>
  )
}

ClientForm.propTypes = {
  client: propTypes.object
}

ClientForm.defaultProps = {
  client: null
}

export default ClientForm
