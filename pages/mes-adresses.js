import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {pick} from 'lodash'
import Pagination from 'react-js-pagination'

import {searchBasesLocales} from '@/lib/api-mes-adresses'
import {STATUSES} from '@/lib/bal-status'

import BaseLocaleItem from '@/components/mes-adresses/base-locale-item'
import SelectInput from '@/components/select-input'
import {CommuneInput} from '@/components/commune-input'

const MesAdresses = ({basesLocales, query, limit, offset, count}) => {
  const router = useRouter()

  const [status, setStatus] = useState(query.status || '')
  const [deleted, setDeleted] = useState(false)

  const [value, setValue] = useState(null)

  const currentPage = Math.ceil((offset - 1) / limit) + 1

  const computeQuery = page => {
    const query = {page, limit, deleted: deleted ? 1 : 0}

    if (status !== '') {
      query.status = status
    }

    if (value) {
      query.commune = value
    }

    return query
  }

  const onPageChange = page => {
    const query = computeQuery(page)
    router.push({pathname: '/mes-adresses', query})
  }

  useEffect(() => {
    const query = computeQuery(1)
    router.push({pathname: '/mes-adresses', query})
  }, [value, deleted, status])

  return (

    <div className='fr-container fr-py-12v'>
      <div className='fr-container--fluid'>
        <h3>Recherche</h3>
        <div className='fr-grid-row fr-grid-row--gutters'>
          <div className='fr-col'>
            <CommuneInput onChange={commune => setValue(commune?.code)} />
          </div>
        </div>

        <div className='fr-grid-row fr-grid-row--gutters'>
          <div className='fr-col-12 fr-col-sm-6'>
            <SelectInput
              label='Statut'
              value={status}
              options={Object.keys(pick(STATUSES, ['draft', 'demo', 'ready-to-publish', 'published'])).map(key => ({value: key, label: STATUSES[key].label}))}
              defaultOption='Tous'
              handleChange={setStatus}
            />
          </div>

          <div className='fr-col-12 fr-col-sm-6'>
            <div className='fr-toggle'>
              <input type='checkbox' className='fr-toggle__input' aria-describedby='toggle-deleted-hint-text' id='toggle-deleted' checked={deleted} onChange={() => setDeleted(!deleted)} />
              <label className='fr-toggle__label' htmlFor='toggle-deleted' data-fr-checked-label='Activé' data-fr-unchecked-label='Désactivé'>Supprimée</label>
              <p className='fr-hint-text' id='toggle-deleted-hint-text'>Affiche uniquement les bases locales supprimées</p>
            </div>
          </div>
        </div>
      </div>
      {basesLocales && basesLocales.length > 0 ? (
        <div className='fr-table'>
          <table>
            <caption>Liste des bases adresses locales</caption>
            <thead>
              <tr>
                <th scope='col'>Nom</th>
                <th scope='col'>Commune</th>
                <th scope='col'>Date de création</th>
                <th scope='col'>Date de mise à jour</th>
                <th scope='col'>Statut</th>
                <th scope='col'>Numéros certifiés</th>
                <th scope='col' />
              </tr>
            </thead>

            <tbody>
              {basesLocales.map(baseLocale => (
                <BaseLocaleItem key={baseLocale._id} {...baseLocale} />
              ))}
            </tbody>
          </table>

          <div className='pagination fr-mx-auto fr-my-2w'>
            <nav role='navigation' className='fr-pagination' aria-label='Pagination'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={limit}
                totalItemsCount={count}
                pageRangeDisplayed={5}
                onChange={onPageChange}
                innerClass='fr-pagination__list'
                activeLinkClass=''
                linkClass='fr-pagination__link'
                linkClassFirst='fr-pagination__link--first'
                linkClassPrev='fr-pagination__link--prev fr-pagination__link--lg-label'
                linkClassNext='fr-pagination__link--next fr-pagination__link--lg-label'
                linkClassLast='fr-pagination__link--last'
              />
            </nav>
          </div>
        </div>
      ) : (
        <p>Aucune base locale n’a été trouvée</p>
      )}
      <style jsx>{`
      .pagination {
        width: fit-content;
      }
      `}</style>
    </div>

  )
}

MesAdresses.defaultProps = {
  offset: 0,
  limit: 20,
  count: 0
}

MesAdresses.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  query: PropTypes.shape({
    commune: PropTypes.string,
    status: PropTypes.oneOf([...Object.keys(STATUSES), null])
  }),
  page: PropTypes.number,
  offset: PropTypes.number,
  limit: PropTypes.number,
  count: PropTypes.number
}

export async function getServerSideProps({query}) {
  let result

  try {
    result = await searchBasesLocales(query)
  } catch {}

  return {
    props: {
      ...result,
      basesLocales: result ? result.results : [],
      query: pick(query, ['commune', 'status'])
    }
  }
}

export default MesAdresses

