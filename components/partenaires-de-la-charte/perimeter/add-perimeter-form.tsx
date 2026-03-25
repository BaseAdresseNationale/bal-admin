import React, { useState } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import SelectInput from "@/components/select-input";
import { TypePerimeterEnum } from "server/lib/partenaire-de-la-charte/clients/pertimeters/entity";
import { PerimeterCodeInput } from "./perimeter-code-input";

const perimeterTypeOptions = Object.values(TypePerimeterEnum).map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

type AddPerimeterFormProps = {
  onAdd: (type: TypePerimeterEnum, code: string) => void;
};

export const AddPerimeterForm = ({ onAdd }: AddPerimeterFormProps) => {
  const [type, setType] = useState<TypePerimeterEnum>(TypePerimeterEnum.COMMUNE);
  const [code, setCode] = useState("");

  const handleTypeChange = (value: TypePerimeterEnum) => {
    setType(value);
    setCode("");
  };

  const handleAdd = () => {
    if (!code.trim()) return;
    onAdd(type, code.trim());
    setCode("");
  };

  return (
    <div
      style={{
        border: "1px solid var(--border-default-grey)",
        borderRadius: "4px",
        padding: "1rem",
      }}
    >
      <h6 style={{ marginBottom: "1rem" }}>Ajouter un périmètre</h6>
      <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
        <div className="fr-col-3">
          <SelectInput
            label="Type"
            value={type}
            options={perimeterTypeOptions}
            handleChange={(value) => handleTypeChange(value as TypePerimeterEnum)}
          />
        </div>
        <div className="fr-col-5">
          <PerimeterCodeInput
            key={type}
            type={type}
            onSelect={(selectedCode) => setCode(selectedCode)}
          />
        </div>
        <div
          className="fr-col-4"
          style={{ display: "flex", alignItems: "flex-end", paddingBottom: "1.5rem" }}
        >
          <Button
            iconId="fr-icon-add-line"
            onClick={handleAdd}
            type="button"
            size="small"
            disabled={!code.trim()}
          >
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};
