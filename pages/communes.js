import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import allCommunes from '@etalab/decoupage-administratif/data/communes.json'
import {SearchBar} from '@codegouvfr/react-dsfr/SearchBar'

import Main from '@/layouts/main'
import {useUser} from '@/hooks/user'
import Loader from '@/components/loader'
import SearchInput from '@/components/search-input'

const communes = allCommunes
  .filter(c => ['commune-actuelle', 'arrondissement-municipal'].includes(c.type))

const Communes = () => {
  const [isAdmin, isLoading] = useUser()
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
          || c.nom.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map(c => ({label: `${c.nom} (${c.code})`, value: c.code}))
        .slice(0, 10)
      setOptions(newOptions)
    }
  }, [inputValue])

  useEffect(() => {
    if (value && value.value) {
      router.push({pathname: `/communes/${value.value}`})
    }
  }, [value, router])

  return (
    <Main isAdmin={isAdmin}>
      <Loader isLoading={isLoading}>
        {isAdmin && (
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
                        onChange={newValue => setValue(newValue)}
                        onInputChange={newValue => setInputValue(newValue)}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Loader>
    </Main>
  )
}

export default Communes

