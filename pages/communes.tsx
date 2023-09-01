import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import allCommunes from '@etalab/decoupage-administratif/data/communes.json'
import {SearchBar} from '@codegouvfr/react-dsfr/SearchBar'

import SearchInput from '@/components/search-input'

const communes = (allCommunes as Array<{nom: string; code: string; type: string}>).filter(c => ['commune-actuelle', 'arrondissement-municipal'].includes(c.type))

const Communes = () => {
  const router = useRouter()

  const [value, setValue] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (inputValue.length <= 2) {
      setOptions([])
    } else if (inputValue.length > 2) {
      const newOptions = communes
        .filter(c =>
          String(c.code).toLowerCase().includes(inputValue.toLowerCase())
          || c.nom.toLowerCase().includes(inputValue.toLowerCase()),
        )
        .map(c => ({label: `${c.nom} (${c.code})`, value: c.code}))
        .slice(0, 10)
      setOptions(newOptions)
    }
  }, [inputValue])

  useEffect(() => {
    if (value?.value) {
      void router.push({pathname: `/communes/${(value.value as string)}`})
    }
  }, [value, router])

  return (
    <div className='fr-container fr-py-12v'>
      <div className='fr-container--fluid'>
        <h3>Recherche</h3>
        <div className='fr-grid-row fr-grid-row--gutters'>
          <div className='fr-col'>
            <SearchBar
              renderInput={({className, id, placeholder, type}) => (
                <SearchInput
                  options={options}
                  className={className}
                  id={id}
                  placeholder={placeholder}
                  type={type}
                  onChange={newValue => {
                    setValue(newValue)
                  }}
                  onInputChange={newValue => {
                    setInputValue(newValue)
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>

  )
}

export default Communes

