import React, {useState, useMemo} from 'react'

type EditableListProps<T> = {
  createBtn?: React.ReactNode;
  caption: string;
  headers: string[];
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  filter?: {
    placeholder?: string;
    property: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const EditableList = <T extends unknown>({
  createBtn,
  headers,
  caption,
  data,
  renderItem,
  filter,
}: EditableListProps<T>) => {
  const [filterInput, setFilterInput] = useState('')

  const filteredData = useMemo(() => {
    if (!filterInput || !filter?.property) {
      return data
    }

    return data.filter(item => item[filter.property].toLowerCase().includes(filterInput.toLowerCase()))
  }, [data, filterInput, filter])

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
        {filteredData.length > 0 ? <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header} scope='col'>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => renderItem(item))}
          </tbody>
        </table> : <caption>Aucun résultat</caption>}
      </div>
    </div>
  )
}
