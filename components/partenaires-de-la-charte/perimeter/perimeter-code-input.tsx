import React, { useState } from "react";
import type Fuse from "fuse.js";
import allCommunes from "@etalab/decoupage-administratif/data/communes.json";
import allEpci from "@etalab/decoupage-administratif/data/epci.json";
import departements from "@etalab/decoupage-administratif/data/departements.json";
import SearchInput from "@/components/search-input";
import SelectInput from "@/components/select-input";
import { useFuse } from "@/hooks/use-fuse";
import { TypePerimeterEnum } from "server/lib/partenaire-de-la-charte/clients/pertimeters/entity";

type Commune = { code: string; nom: string; type: string };
type Epci = { code: string; nom: string };
type Departement = { code: string; nom: string };

const communeOptions = (allCommunes as Commune[]).filter((c) =>
  ["commune-actuelle", "arrondissement-municipal"].includes(c.type),
);

const departementsOptions = (departements as Departement[]).map((d) => ({
  value: d.code,
  label: `${d.code} — ${d.nom}`,
}));

const fuseOptions = { keys: ["nom", "code"], threshold: 0.3 };

type PerimeterCodeInputProps = {
  type: TypePerimeterEnum;
  onSelect: (code: string) => void;
};

export const PerimeterCodeInput = ({ type, onSelect }: PerimeterCodeInputProps) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const communeSearch = useFuse(communeOptions, fuseOptions);
  const epciSearch = useFuse(allEpci as Epci[], fuseOptions);

  const handleSelect = (code: string, label: string) => {
    setSelectedLabel(label);
    onSelect(code);
  };

  const handleClear = () => {
    setSelectedLabel(null);
    onSelect("");
  };

  if (type === TypePerimeterEnum.DEPARTEMENT) {
    return (
      <SelectInput
        label="Code département"
        value=""
        options={[{ value: "", label: "Sélectionnez un département" }, ...departementsOptions]}
        handleChange={(value) => {
          const dep = (departements as Departement[]).find((d) => d.code === (value as string));
          handleSelect(value as string, dep ? `${dep.code} — ${dep.nom}` : value as string);
        }}
      />
    );
  }

  if (selectedLabel) {
    return (
      <div className="fr-select-group">
        <label className="fr-label">
          {type === TypePerimeterEnum.COMMUNE ? "Commune" : "EPCI"}
        </label>
        <div
          className="fr-input"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <span>{selectedLabel}</span>
          <button type="button" onClick={handleClear} title="Réinitialiser">
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (type === TypePerimeterEnum.COMMUNE) {
    return (
      <div className="fr-select-group">
        <label className="fr-label">Commune</label>
        <SearchInput
          inputProps={{ placeholder: "Rechercher une commune (nom ou code)" }}
          fetchResults={communeSearch}
          ResultCmp={(result: Fuse.FuseResult<Commune>) => (
            <div>
              <button
                type="button"
                className="autocomplete-btn"
                onClick={() =>
                  handleSelect(result.item.code, `${result.item.nom} (${result.item.code})`)
                }
              >
                {result.item.nom} ({result.item.code})
              </button>
            </div>
          )}
        />
      </div>
    );
  }

  // EPCI
  return (
    <div className="fr-select-group">
      <label className="fr-label">EPCI</label>
      <SearchInput
        inputProps={{ placeholder: "Rechercher un EPCI (nom ou code)" }}
        fetchResults={epciSearch}
        ResultCmp={(result: Fuse.FuseResult<Epci>) => (
          <div>
            <button
              type="button"
              className="autocomplete-btn"
              onClick={() =>
                handleSelect(result.item.code, `${result.item.nom} (${result.item.code})`)
              }
            >
              {result.item.nom} ({result.item.code})
            </button>
          </div>
        )}
      />
    </div>
  );
};
