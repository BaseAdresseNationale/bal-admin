import { useMemo } from "react";

import SelectInput from "@/components/select-input";
import { ChefDeFile } from "types/api-depot.types";

interface ChefDeFileSelectProps {
  selectedChefDeFile: string;
  chefsDeFile: ChefDeFile[];
  onSelect: (value: any) => void;
}

const ChefDeFileSelect = ({
  selectedChefDeFile,
  chefsDeFile,
  onSelect,
}: ChefDeFileSelectProps) => {
  const chefsDeFileOptions = useMemo(
    () =>
      chefsDeFile.map((m) => ({
        label: m.nom + " (" + m.email + ")",
        value: m.id,
      })),
    [chefsDeFile]
  );

  return (
    <div className="fr-my-4w">
      <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
        <div className="fr-col-sm-12 fr-col-md-4">
          <SelectInput
            label="Chef de file"
            hint="Chef de file du client"
            value={selectedChefDeFile}
            defaultOption="Aucun"
            options={chefsDeFileOptions}
            handleChange={onSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default ChefDeFileSelect;
