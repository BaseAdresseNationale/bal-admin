import {useCallback} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import Pagination from 'react-js-pagination'

import {searchBasesLocales} from '@/lib/api-mes-adresses'

import Main from '@/layouts/main'

import {useUser} from '@/hooks/user'

import BaseLocaleItem from '@/components/mes-adresses/base-locale-item'
import Loader from '@/components/loader'

const MesAdresses = ({basesLocales, commune, limit, offset, count}) => {
  const [isAdmin, isLoading] = useUser()
  const router = useRouter()

  const currentPage = Math.ceil((offset - 1) / limit) + 1

  const onPageChange = useCallback(page => {
    router.push(`/mes-adresses?page=${page}`)
  }, [router])

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
          <div className='fr-container fr-py-12v'>
            <div className='fr-table'>
              <table>
                <caption>Liste des bases adresses locales</caption>
                <thead>
                  <tr>
                    <th scope='col'>Nom</th>
                    <th scope='col'>Date de création</th>
                    <th scope='col'>Date de mise à jour</th>
                    <th scope='col'>Statut</th>
                    <th scope='col'>Numéros certifiés</th>
                    <th scope='col'>Supprimée</th>
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
  offset: 0,
  limit: 20,
  count: 0
}

MesAdresses.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  commune: PropTypes.string.isRequired,
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
      commune: query.commune || '',
      basesLocales: result ? result.results : []
    }
  }
}

export default MesAdresses

