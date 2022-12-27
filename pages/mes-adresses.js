import {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {pick} from 'lodash'
import Pagination from 'react-js-pagination'

import {searchBasesLocales} from '@/lib/api-mes-adresses'
import {STATUSES} from '@/lib/bal-status'
import {isCommune} from '@/lib/cog'

import Main from '@/layouts/main'

import {useUser} from '@/hooks/user'

import BaseLocaleItem from '@/components/mes-adresses/base-locale-item'
import Loader from '@/components/loader'

const MesAdresses = ({basesLocales, query, page, limit, offset, count}) => {
  const [isAdmin, isLoading] = useUser()
  const router = useRouter()

  const [input, setInput] = useState(query?.commune || query?.email || '')
  const [inputCommune, setInputCommune] = useState(query.commune)
  const [inputEmail, setInputEmail] = useState(query.email)
  const [status, setStatus] = useState(query.status || '')
  const [deleted, setDeleted] = useState(false)
  const [isInputError, setIsInputError] = useState()

  const currentPage = Math.ceil((offset - 1) / limit) + 1

  const onPageChange = useCallback(page => {
    router.push(`/mes-adresses?page=${page}`)
  }, [router])

  const submitInput = useCallback(event => {
    event.preventDefault()

    setIsInputError(false)
    setInputCommune(null)
    setInputEmail(null)

    if (input.includes('@')) {
      setInputEmail(input)
    } else if (isCommune(input)) {
      setInputCommune(input)
    } else {
      setIsInputError(true)
    }
  }, [input])

  useEffect(() => {
    const query = {page, limit, deleted: deleted ? 1 : 0}

    if (status !== '') {
      query.status = status
    }

    if (inputEmail) {
      query.email = inputEmail
    }

    if (inputCommune) {
      query.commune = inputCommune
    }

    router.push({pathname: '/mes-adresses', query})
  }, [page, limit, inputEmail, inputCommune, deleted, status]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container fr-py-12v'>
            <div className='fr-container--fluid'>
              <h3>Recherche</h3>
              <div className='fr-grid-row fr-grid-row--gutters'>
                <div className='fr-col'>
                  <form onSubmit={submitInput}>
                    <div className='fr-search-bar' id='search-input' role='search'>
                      <input
                        className={`fr-input ${isInputError ? 'fr-input--error' : ''}`}
                        placeholder='Recherche code commune ou email'
                        type='search'
                        value={input}
                        id='search-input'
                        name='search-input'
                        onChange={e => setInput(e.target.value)}
                      />
                      <button type='submit' className='fr-btn' title='Rechercher'>
                        Rechercher
                      </button>
                    </div>
                    {isInputError && (
                      <p id='text-input-error-desc-error' className='fr-error-text'>
                        Veuillez indiquer un code commune ou une adresse email
                      </p>
                    )}
                  </form>
                </div>
              </div>

              <div className='fr-grid-row fr-grid-row--gutters'>
                <div className='fr-col-12 fr-col-sm-6'>
                  <div className='fr-select-group'>
                    <label className='fr-label' htmlFor='select-status'>
                      Statut
                    </label>
                    <select className='fr-select' id='select-status' name='select-status' value={status} onChange={e => setStatus(e.target.value)}>
                      <option value='' disabled hidden>Tous</option>
                      {Object.keys(STATUSES).map(key => (
                        <option key={key} value={key}>{STATUSES[key].label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='fr-col-12 fr-col-sm-6'>
                  <div className='fr-toggle'>
                    <input type='checkbox' className='fr-toggle__input' aria-describedby='toggle-deleted-hint-text' id='toggle-deleted' checked={deleted} onChange={() => setDeleted(!deleted)} />
                    <label className='fr-toggle__label' htmlFor='toggle-deleted' data-fr-checked-label='Activé' data-fr-unchecked-label='Désactivé'>Supprimée</label>
                    <p className='fr-hint-text' id='toggle-deleted-hint-text'>Affiche uniquemen les bases locales supprimées</p>
                  </div>
                </div>
              </div>
            </div>
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
                  {basesLocales.length > 0 ? (
                    basesLocales.map(baseLocale => (
                      <BaseLocaleItem key={baseLocale._id} {...baseLocale} />
                    ))) : (
                    'Aucune base locale n’a été trouvée'
                  )}
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
          </div>
        )}
      </Loader>

      <style jsx>{`
        .pagination {
          width: fit-content;
        }
        `}</style>
    </Main>
  )
}

MesAdresses.defaultProps = {
  page: 1,
  offset: 0,
  limit: 20,
  count: 0
}

MesAdresses.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  query: PropTypes.shape({
    commune: PropTypes.string,
    email: PropTypes.string,
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
      query: pick(query, ['commune', 'email', 'status'])
    }
  }
}

export default MesAdresses

