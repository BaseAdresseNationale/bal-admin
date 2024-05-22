import React, { useState } from "react";
import type Fuse from "fuse.js";
import allCommunes from "@etalab/decoupage-administratif/data/communes.json";
import SearchInput from "@/components/search-input";
import { useFuse } from "@/hooks/use-fuse";
import styled from "styled-components";
import Button from "@codegouvfr/react-dsfr/Button";

const allOptions = (allCommunes as CommuneType[]).filter((c) =>
  ["commune-actuelle", "arrondissement-municipal"].includes(c.type)
);

export type CommuneType = {
  code: string;
  nom: string;
  typeLiaison: number;
  zone: string;
  arrondissement: string;
  departement: string;
  region: string;
  type: string;
  rangChefLieu: number;
  siren: string;
  codesPostaux: string[];
  population: number;
};

type CommuneInputProps = {
  label?: string;
  onChange: (value?: CommuneType) => void;
};

const StyledSelectedCommune = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CommuneInput = ({ label, onChange }: CommuneInputProps) => {
  const [value, setValue] = useState<CommuneType>();
  const [fuseOptions] = useState({
    keys: ["nom", "code"],
    threshold: 0.4,
  });

  const fuzzySearch = useFuse(allOptions, fuseOptions);

  const handleChange = (value: CommuneType) => {
    setValue(value);
    onChange(value);
  };

  const handleClear = () => {
    setValue(undefined);
    onChange(undefined);
  };

  return (
    <div className="fr-select-group" style={{ padding: 5 }}>
      {label && (
        <label
          className="fr-label"
          style={{ marginBottom: 8 }}
          htmlFor={`select-${label}`}
        >
          {label}
        </label>
      )}
      {value ? (
        <StyledSelectedCommune className="fr-input">
          <span>
            {value.nom} ({value.code})
          </span>
          <button
            type="button"
            onClick={handleClear}
            title="Réinitialiser la commune"
          >
            X
          </button>
        </StyledSelectedCommune>
      ) : (
        <SearchInput
          inputProps={{ placeholder: "Rechercher une commune" }}
          fetchResults={fuzzySearch}
          ResultCmp={(result: Fuse.FuseResult<CommuneType>) => (
            <div>
              <button
                type="button"
                className="autocomplete-btn"
                onClick={() => handleChange(result.item)}
              >
                {result.item.nom} ({result.item.code})
              </button>
            </div>
          )}
        />
      )}
    </div>
  );
};
