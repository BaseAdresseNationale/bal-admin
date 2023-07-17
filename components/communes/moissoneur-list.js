import PropTypes from 'prop-types'
import {useState, useEffect, useMemo} from 'react'
import Pagination from 'react-js-pagination'

import {getRevisionsByCommune} from '@/lib/api-moissonneur-bal'
import RevisionItem from '@/components/moissonneur-bal/revision-item'

const MoissoneurList = ({code}) => {
  const [revisions, setRevisions] = useState([])

  const [page, setPage] = useState({
    limit: 5,
    count: 0,
    current: 1,
  })

  useEffect(() => {
    const fetchData = async codeCommune => {
      const data = await getRevisionsByCommune(codeCommune)
      setRevisions(data)
      setPage(page => ({...page, count: data.length}))
    }

    fetchData(code).catch(console.error)
  }, [code])

  const onPageChange = newPage => {
    setPage(page => ({...page, current: newPage}))
  }

  const revisionsPage = useMemo(() => {
    const start = (page.current - 1) * page.limit
    const end = (page.current) * page.limit
    return revisions.slice(start, end)
  }, [page, revisions])

  return (
    <div className='fr-py-4v'>
      <h2 className='fr-m-1v' >Révisions Moissoneur</h2>
      <div className='fr-container fr-py-4v'>
        <div className='fr-grid-row fr-grid-row--gutters'>
          {revisions && revisions.length > 0 ? (
            <div className='fr-col-10'>

              <table className='fr-table'>
                <thead>
                  <tr>
                    <th scope='col'>Id</th>
                    <th scope='col'>Source</th>
                    <th scope='col'>Nombre de ligne</th>
                    <th scope='col'>Nombre de ligne en erreur</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Publication</th>
                  </tr>
                </thead>

                <tbody>
                  {revisionsPage.map(revision => (
                    <RevisionItem
                      key={revision._id}
                      {...revision}
                      ignoreFields={['commune', 'file', 'force']}
                    />
                  ))}
                </tbody>
              </table>

              <div className='pagination fr-mx-auto fr-my-2w'>
                <nav role='navigation' className='fr-pagination' aria-label='Pagination'>
                  <Pagination
                    activePage={page.current}
                    itemsCountPerPage={page.limit}
                    totalItemsCount={page.count}
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
            <div className='fr-col-10'>
              <p>Aucune révision n’a été trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

MoissoneurList.propTypes = {
  code: PropTypes.string.isRequired,
}

export default MoissoneurList
