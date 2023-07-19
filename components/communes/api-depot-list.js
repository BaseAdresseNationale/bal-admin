
import PropTypes from 'prop-types'
import {useState, useEffect, useMemo} from 'react'
import Pagination from 'react-js-pagination'
import Alert from '@codegouvfr/react-dsfr/Alert'
import {createModal} from '@codegouvfr/react-dsfr/Modal'

import {getRevisionByCommune, deleteRevision} from '@/lib/api-depot'
import RevisionItem from '@/components/communes/api-depot/revisions-item'

const modal = createModal({
  id: 'delete-revision-modal',
  isOpenedByDefault: false
})

const ApiDepotList = ({code}) => {
  const [revisions, setRevisions] = useState([])
  const [error, setError] = useState(null)
  const [revisionToDeleted, setRevisionToDeleted] = useState(null)

  const [page, setPage] = useState({
    limit: 5,
    count: 0,
    current: 1,
  })

  const fetchData = async codeCommune => {
    const data = await getRevisionByCommune(codeCommune)
    setRevisions(data)
    setPage(page => ({...page, count: data.length}))
  }

  useEffect(() => {
    fetchData(code).catch(console.error)
  }, [code])

  const onPageChange = newPage => {
    setPage(page => ({...page, current: newPage}))
  }

  const openModal = async revision => {
    setRevisionToDeleted(revision)
    modal.open()
  }

  async function onDelete() {
    try {
      await deleteRevision(revisionToDeleted._id)
      setRevisionToDeleted(null)
      fetchData(code).catch(console.error)
      modal.close()
    } catch (e) {
      console.error(e)
      setError('Impossible de supprimer cette revision')
      setTimeout(() => setError(null), 5000)
    }
  }

  const revisionsPage = useMemo(() => {
    const start = (page.current - 1) * page.limit
    const end = (page.current) * page.limit
    return revisions.slice(start, end)
  }, [page, revisions])

  return (
    <>
      <modal.Component
        title='Voulez vous vraiment supprimer cette revision ?'
        buttons={
          [
            {
              doClosesModal: true,
              children: 'Annuler'
            },
            {
              doClosesModal: false,
              onClick: () => onDelete(),
              children: 'Supprimer'
            }
          ]
        }
      >
        {error && <Alert
          className='fr-my-2w'
          title='Erreur'
          description={error}
          severity='error'
          closable={false}
          small
        />}
      </modal.Component>
      <div className='fr-py-4v'>
        <h2 className='fr-m-1v' >Révisions Api Depot</h2>
        <div className='fr-container fr-py-4v'>
          <div className='fr-grid-row fr-grid-row--gutters'>
            {revisions && revisions.length > 0 ? (
              <div className='fr-col-10'>

                <table className='fr-table'>
                  <thead>
                    <tr>
                      <th scope='col'>Id</th>
                      <th scope='col'>Client</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Current</th>
                      <th scope='col'>Validation</th>
                      <th scope='col'>Date création</th>
                      <th scope='col'>Date publication</th>
                      <th scope='col'>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {revisionsPage.map(revision => (
                      <RevisionItem
                        key={revision._id}
                        {...revision}
                        onDelete={() => openModal(revision)}
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
    </>
  )
}

ApiDepotList.propTypes = {
  code: PropTypes.string.isRequired,
}

export default ApiDepotList
