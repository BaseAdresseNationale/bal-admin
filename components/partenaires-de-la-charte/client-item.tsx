import React, { useState } from "react";
import styled from "styled-components";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import SelectInput from "@/components/select-input";

const StyledAccordionWrapper = styled.div`
  .fr-accordion:has(.fr-accordion__btn[aria-expanded="true"]) {
    border: 1px solid var(--border-active-blue-france);
    border-radius: 4px;
  }
`;
import {
  Client,
  ClientTypeEnum,
} from "server/lib/partenaire-de-la-charte/clients/entity";
import { TypePerimeterEnum } from "server/lib/partenaire-de-la-charte/clients/pertimeters/entity";

const perimeterTypeOptions = Object.values(TypePerimeterEnum).map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

type ClientItemProps = {
  client: Client;
  clientLabel: string;
  onChange: (updated: Client) => void;
  onRemove: () => void;
};

export const ClientItem = ({
  client,
  clientLabel,
  onChange,
  onRemove,
}: ClientItemProps) => {
  const [newPerimeterType, setNewPerimeterType] = useState<TypePerimeterEnum>(
    TypePerimeterEnum.COMMUNE,
  );
  const [newPerimeterCode, setNewPerimeterCode] = useState("");

  const handleAddPerimeter = () => {
    if (!newPerimeterCode.trim()) return;
    const updated: Client = {
      ...client,
      perimeters: [
        ...(client.perimeters || []),
        { type: newPerimeterType, code: newPerimeterCode.trim() },
      ],
    };
    onChange(updated);
    setNewPerimeterCode("");
  };

  const handleRemovePerimeter = (index: number) => {
    const updated: Client = {
      ...client,
      perimeters: (client.perimeters || []).filter((_, i) => i !== index),
    };
    onChange(updated);
  };

  const clientTypeSeverity =
    client.type === ClientTypeEnum.API_DEPOT ? "new" : "info";

  return (
    <StyledAccordionWrapper>
    <Accordion
      style={{ margin: 0 }}
      label={
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Badge severity={clientTypeSeverity} noIcon>
            {client.type}
          </Badge>
          {clientLabel}
        </span>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Ajouter un périmètre */}
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
                value={newPerimeterType}
                options={perimeterTypeOptions}
                handleChange={(value) =>
                  setNewPerimeterType(value as TypePerimeterEnum)
                }
              />
            </div>
            <div className="fr-col-5">
              <Input
                label="Code"
                nativeInputProps={{
                  value: newPerimeterCode,
                  onChange: (e) => setNewPerimeterCode(e.target.value),
                  placeholder:
                    newPerimeterType === TypePerimeterEnum.COMMUNE
                      ? "Ex : 01001"
                      : newPerimeterType === TypePerimeterEnum.DEPARTEMENT
                        ? "Ex : 01"
                        : "Ex : 200000172",
                }}
              />
            </div>
            <div
              className="fr-col-4"
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: "1.5rem",
              }}
            >
              <Button
                iconId="fr-icon-add-line"
                onClick={handleAddPerimeter}
                type="button"
                size="small"
                disabled={!newPerimeterCode.trim()}
              >
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des périmètres */}
        <div>
          <h6 style={{ marginBottom: "0.5rem" }}>
            Périmètres ({(client.perimeters || []).length})
          </h6>
          {(client.perimeters || []).length === 0 ? (
            <p className="fr-text--sm fr-text--mention-grey">
              Aucun périmètre défini
            </p>
          ) : (
            <ul className="fr-tags-group">
              {(client.perimeters || []).map((perimeter, index) => (
                <li key={index}>
                  <button
                    className="fr-tag fr-tag--sm fr-tag--dismiss"
                    aria-label={`Supprimer le périmètre ${perimeter.type} ${perimeter.code}`}
                    onClick={() => handleRemovePerimeter(index)}
                    type="button"
                  >
                    {perimeter.type} — {perimeter.code}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            borderTop: "1px solid var(--border-default-grey)",
            paddingTop: "1rem",
          }}
        >
          <Button
            iconId="fr-icon-delete-line"
            priority="tertiary no outline"
            onClick={onRemove}
            type="button"
            size="small"
          >
            Supprimer ce client
          </Button>
        </div>
      </div>
    </Accordion>
    </StyledAccordionWrapper>
  );
};
