import router from 'next/router'
import {useIsDark} from '@codegouvfr/react-dsfr'

const Client = ({client}) => {
  const {isDark} = useIsDark()
  const {nom, chefDeFile, mandataire, active, authorizationStrategy} = {...client}
  const handleClick = () => {
    router.push({
      pathname: '/client',
      query: client
    })
  }

  return (
    <div className='fr-container'>
      <div className='fr-grid-row border-bottom text-center fr-p-2w'>
        <div className='fr-col-12 fr-col-md-2 align fr-my-1w'>
          {nom}
        </div>
        <div className='fr-col-12 fr-col-md-2 align fr-my-1w'>
          {chefDeFile}
        </div>
        <div className='fr-col-12 fr-col-md-2 align fr-my-1w'>
          {mandataire}
        </div>
        <div className='fr-col-12 fr-col-md-2 align fr-my-1w'>
          {authorizationStrategy}
        </div>
        <div className='fr-col-6 fr-col-md-2 align fr-my-1w'>
          {active ? '✔️' : '❌'}
        </div>
        <div className='fr-col-6 fr-col-md-2 align fr-my-1w'>
          <div
            className='fr-tag pointer'
            target='_self'
            onClick={handleClick}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill={isDark ? '#FFFF' : '#lalala'} ><path d='M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z' /></svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-center {
          text-align: center;
        }

        .pointer {
          cursor: pointer;
        }

        .align {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cell {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1em;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        }

        .border-bottom {
          border-bottom: 1px solid #e5e5e5;
        }
      `}</style>
    </div>
  )
}

export default Client
