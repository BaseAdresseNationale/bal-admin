import PropTypes from 'prop-types'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import Button from '@codegouvfr/react-dsfr/Button'
import Badge from '@codegouvfr/react-dsfr/Badge'

import {searchBasesLocales} from '@/lib/api-mes-adresses'
import {computeStatus} from '@/lib/bal-status'
import {formatDate} from '@/lib/util/date'

const MesAdresseList = ({code}) => {
  const [bals, setBals] = useState([])

  useEffect(() => {
    const fetchData = async codeInsee => {
      const data = await searchBasesLocales({commune: codeInsee})
      setBals(data.results)
    }

    fetchData(code).catch(console.error)
  }, [code])

  return (
    <div className='fr-py-4v'>
      <h2 className='fr-m-1v' >Bals Mes Adresses</h2>
      <div className='fr-container fr-py-4v'>
        <div className='fr-grid-row fr-grid-row--gutters'>
          <div className='fr-col-10'>
            {bals && bals.length > 0 ? (
              <table className='fr-table'>
                <thead>
                  <tr>
                    <th scope='col'>Id</th>
                    <th scope='col'>nom</th>
                    <th scope='col'>Statut</th>
                    <th scope='col'>Date de création</th>
                    <th scope='col'>Date de mise à jour</th>
                    <th scope='col' />
                  </tr>
                </thead>

                <tbody>
                  {bals.map(bal => (
                    <tr key={bal._id}>
                      <td className='fr-col fr-my-1v'>{bal._id}</td>
                      <td className='fr-col fr-my-1v'>{bal.nom}</td>
                      <td className='fr-col fr-my-1v'>
                        <Badge severity={computeStatus(bal.status, bal.sync).intent} noIcon>{computeStatus(bal.status, bal.sync).label}</Badge>
                      </td>
                      <td className='fr-col fr-my-1v'>
                        {bal._created ? formatDate(bal._created) : 'inconnu'}
                      </td>
                      <td className='fr-col fr-my-1v'>
                        {bal._updated ? formatDate(bal._updated) : 'inconnu'}
                      </td>
                      <td className='fr-col fr-my-1v'>
                        <Link passHref href={{pathname: '/mes-adresses/base-locale', query: {baseLocaleId: bal._id}}}>
                          <Button iconId='fr-icon-arrow-right-line' iconPosition='right'>
                            Consulter
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune base locale n’a été trouvée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

MesAdresseList.propTypes = {
  code: PropTypes.string.isRequired,
}

export default MesAdresseList
