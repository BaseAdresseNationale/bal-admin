import React from "react";
import styled from "styled-components";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import {
  Client,
  ClientTypeEnum,
} from "server/lib/partenaire-de-la-charte/clients/entity";
import { TypePerimeterEnum } from "server/lib/partenaire-de-la-charte/clients/pertimeters/entity";
import { PerimeterForm } from "../perimeter/perimeter-form";

const StyledAccordionWrapper = styled.div`
  .fr-accordion:has(.fr-accordion__btn[aria-expanded="true"]) {
    border: 1px solid var(--border-active-blue-france);
    border-radius: 4px;
  }
`;

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
  const handleAddPerimeter = (type: TypePerimeterEnum, code: string) => {
    onChange({
      ...client,
      perimeters: [...(client.perimeters || []), { type, code }],
    });
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
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Badge severity={clientTypeSeverity} noIcon>
              {client.type}
            </Badge>
            {clientLabel}
            {client.deletedAt ? (
              <Badge severity="warning" noIcon>
                SUPPRIMER
              </Badge>
            ) : null}
          </span>
        }
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <PerimeterForm
            perimeters={client.perimeters || []}
            onAdd={handleAddPerimeter}
            onRemove={handleRemovePerimeter}
          />

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
