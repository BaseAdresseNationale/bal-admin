import { useEffect, useMemo, useState } from "react";
import { uniqueId } from "lodash";
import Fuse from "fuse.js";
import epcis from "@etalab/decoupage-administratif/data/epci.json";
import departements from "@etalab/decoupage-administratif/data/departements.json";
import allCommunes from "@etalab/decoupage-administratif/data/communes.json";

import AutocompleteInput from "@/components/autocomplete-input";
import SelectInput from "@/components/select-input";
import { PerimeterType, TypePerimeterEnum } from "types/api-depot";
import { Tooltip } from "@codegouvfr/react-dsfr/Tooltip";
import Badge from "@codegouvfr/react-dsfr/Badge";

const typeOptions = [
  { label: "EPCI", value: "epci" },
  { label: "Département", value: "departement" },
  { label: "Commune", value: "commune" },
];

const epcisOptions: { value: string; label: string }[] = epcis.map(
  ({ code, nom }) => ({ value: code, label: nom })
);

const departementOptions: { value: string; label: string }[] = departements.map(
  ({ code, nom }) => ({
    value: code,
    label: nom,
  })
);

const communeOptions: { value: string; label: string }[] = allCommunes
  .filter((c) =>
    ["commune-actuelle", "arrondissement-municipal"].includes(c.type)
  )
  .map(({ code, nom }) => ({ value: code, label: nom }));

const fuseTypes = {
  epci: new Fuse(epcisOptions, { keys: ["value", "label"], threshold: 0.4 }),
  departement: new Fuse(departementOptions, {
    keys: ["value", "label"],
    threshold: 0.4,
  }),
  commune: new Fuse(communeOptions, {
    keys: ["value", "label"],
    threshold: 0.4,
  }),
};

interface PerimetreProps {
  type: TypePerimeterEnum;
  code: string;
  handlePerimeter: (value: PerimeterType) => void;
}

const Perimeter = ({ type, code, handlePerimeter }: PerimetreProps) => {
  const [fuzeSearch, setFuzeSearch] = useState<null | Fuse<{
    value: string;
    label: string;
  }>>(null);
  const [perimetreOptions, setPerimetreOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    setPerimetreOptions([]);
    setFuzeSearch(fuseTypes[type]);
  }, [type]);

  const handleChange = (e: any) => {
    const newCode = e.target.value;
    handlePerimeter({ type, code: newCode });
    if (newCode.length >= 2) {
      const results = fuzeSearch.search(newCode).slice(0, 10);
      setPerimetreOptions(results.map(({ item }) => item));
    }
  };

  const communeFromEPCI = useMemo(() => {
    if (type === TypePerimeterEnum.EPCI) {
      return epcis
        .find((epci) => epci.code === code)
        ?.membres.map((commune) => `${commune.nom} (${commune.code})`)
        .join(", ");
    }
    return null;
  }, [type, code]);

  return (
    <div className="fr-grid-row fr-grid-row--gutters">
      <div className="fr-col-5">
        <SelectInput
          label="Type"
          value={type}
          options={typeOptions}
          isMultiple={false}
          handleChange={(v) =>
            handlePerimeter({ type: v as TypePerimeterEnum, code: "" })
          }
        />
      </div>

      <div className="fr-col-5">
        <AutocompleteInput
          id={uniqueId()}
          label="Code"
          options={perimetreOptions}
          value={code}
          onChange={handleChange}
        />
      </div>
      <div className="fr-col-2" style={{ alignContent: "end" }}>
        {type === TypePerimeterEnum.EPCI && (
          <Tooltip kind="hover" title={communeFromEPCI} />
        )}
      </div>
    </div>
  );
};

export default Perimeter;
