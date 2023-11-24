import React, {useState, useMemo, useEffect} from 'react'
import Pagination from 'react-js-pagination'

type EditableListProps<T> = {
  createBtn?: React.ReactNode;
  caption: string;
  headers: string[];
  data: T[];
  renderItem: (item: T, actions?: Record<string, (item: T) => void>) => React.ReactNode;
  filter?: {
    placeholder?: string;
    property: string;
  };
  page?: {
    current: number;
    limit: number;
    count: number;
    onPageChange: (page: number) => void;
  };
  actions?: Record<string, (item: T) => void>;
}

export const EditableList = <T extends unknown>({
  createBtn,
  headers,
  caption,
  data,
  renderItem,
  filter,
  page,
  actions,
}: EditableListProps<T>) => {
  const [filterInput, setFilterInput] = useState('')
  const pageinationRef = React.createRef<HTMLDivElement>()

  const filteredData = useMemo(() => {
    if (!filterInput || !filter?.property) {
      return data
    }

    return data.filter(item => item[filter.property].toLowerCase().includes(filterInput.toLowerCase()))
  }, [data, filterInput, filter])

  useEffect(() => {
    if (pageinationRef.current) {
      const paginationLinks = pageinationRef.current.querySelectorAll('.fr-pagination__link')
      paginationLinks.forEach((link: Element, index) => {
        if (index - 1 === page?.current) {
          link.setAttribute('aria-current', 'page')
        } else {
          link.removeAttribute('aria-current')
        }
      })
    }
  }, [pageinationRef, page])

  return (
    <div className='fr-container fr-py-12v'>
      {filter?.property && (
        <div style={{marginBottom: 20}} className='fr-search-bar'>
          <input value={filterInput} onChange={event => {
            setFilterInput(event.target.value)
          }} className='fr-input' placeholder={filter.placeholder || 'Filtrer'} />
          <button type='button' className='fr-btn' title='Filter'>
            Filtrer
          </button>
        </div>
      )}
      {createBtn}
      <div className='fr-table'>
        <h3>{caption}</h3>
        <br />
        {filteredData.length > 0 ? (
          <table>
            <thead>
              <tr>
                {headers.map(header => (
                  <th key={header} scope='col'>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => renderItem(item, actions))}
            </tbody>
          </table>
        ) : <p>Aucun résultat</p>}
        {(page !== undefined && filteredData.length > 0) && (
          <div className='pagination fr-mx-auto fr-my-2w'>
            <nav ref={pageinationRef} role='navigation' className='fr-pagination' aria-label='Pagination'>
              <Pagination
                activePage={page.current}
                itemsCountPerPage={page.limit}
                totalItemsCount={page.count}
                pageRangeDisplayed={5}
                onChange={page.onPageChange}
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
        )}
      </div>
    </div>
  )
}
