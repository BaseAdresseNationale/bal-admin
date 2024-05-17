import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface SearchInputProps<T> {
  fetchResults: (search: string) => any;
  ResultCmp: React.FC<T>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const StyledSearchInput = styled.div`
  position: relative;
  .fr-input {
    outline: none;
  }
  .results {
    position: absolute;
    background-color: #fff;
    width: 100%;
    border: 1px solid #ccc;
    border-top: none;
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 0 0 4px 4px;

    > div {
      > button {
        width: 100%;
        text-align: left;
        padding: 10px;
        &:hover {
          background-color: #eee;
        }
      }
    }

    > p {
      padding: 5px 10px;
      margin: 0;
    }
  }
`;

const SearchInput = <T extends { item: any }>({
  ResultCmp,
  inputProps,
  fetchResults,
}: SearchInputProps<T>) => {
  const searchTimeoutRef = useRef({} as NodeJS.Timeout);
  const [hasFocus, setHasFocus] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<T[]>([]);

  useEffect(() => {
    async function updateResults() {
      if (search.length >= 3) {
        const results = await fetchResults(search);
        setResults(results);
      } else {
        setResults([]);
      }
    }

    updateResults();
  }, [search, fetchResults]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 3) {
      setSearch(e.target.value);
    } else if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 500);
  };

  return (
    <StyledSearchInput>
      <div className="fr-search-bar" id="header-search" role="search">
        <input
          className="fr-input"
          onChange={onSearch}
          onFocus={() => setHasFocus(true)}
          onBlur={(e) => {
            if (
              e.relatedTarget instanceof Element &&
              e.relatedTarget.className === "autocomplete-btn"
            ) {
              return;
            }
            setHasFocus(false);
          }}
          type="search"
          id="autocomplete-search"
          name="autocomplete-search"
          {...inputProps}
        />
        <button
          type="button"
          className="fr-btn"
          title="Rechercher"
          disabled={inputProps?.disabled}
        >
          Rechercher
        </button>
      </div>
      {hasFocus && (
        <div className="results">
          {results.length > 0 &&
            results.map((result: T) => (
              <ResultCmp key={result.item.code} {...result} />
            ))}
          {results.length === 0 && search.length >= 3 && <p>Aucun résultat</p>}
          {results.length === 0 && search.length > 0 && search.length < 3 && (
            <p>Votre recherche doit comporter au moins 3 caractères</p>
          )}
        </div>
      )}
    </StyledSearchInput>
  );
};

export default SearchInput;
