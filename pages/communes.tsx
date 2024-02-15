import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import allCommunes from "@etalab/decoupage-administratif/data/communes.json";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";

import SearchInput from "@/components/search-input";
import { useFuse } from "@/hooks/use-fuse";
import { useDebounce } from "@/hooks/use-debounce";

const communes = (
  allCommunes as Array<{ nom: string; code: string; type: string }>
).filter((c) =>
  ["commune-actuelle", "arrondissement-municipal"].includes(c.type)
);

const Communes = () => {
  const router = useRouter();

  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const fuzzySearch = useFuse(communes, ["nom", "code"], setOptions);
  const debouncedFuzzySearch = useDebounce(fuzzySearch, 500);

  useEffect(() => {
    debouncedFuzzySearch(inputValue);
  }, [debouncedFuzzySearch, inputValue]);

  useEffect(() => {
    if (value?.value) {
      void router.push({ pathname: `/communes/${value.value as string}` });
    }
  }, [value, router]);

  return (
    <div className="fr-container fr-py-12v">
      <div className="fr-container--fluid">
        <h3>Recherche</h3>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col">
            <SearchBar
              renderInput={({ className, id, placeholder, type }) => (
                <SearchInput
                  options={options}
                  className={className}
                  id={id}
                  placeholder={placeholder}
                  type={type}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  onInputChange={(newValue) => {
                    setInputValue(newValue);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communes;
