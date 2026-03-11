import React, { useState } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import SelectInput from "@/components/select-input";
import {
  Client as PartenaireClient,
  ClientTypeEnum,
} from "../../../server/lib/partenaire-de-la-charte/clients/entity";
import { ClientItem } from "./client-item";

type ClientListProps = {
  clients: PartenaireClient[];
  allClients: PartenaireClient[];
  onChange: (clients: PartenaireClient[]) => void;
};

const clientTypeOptions = Object.values(ClientTypeEnum).map((value) => ({
  value,
  label: value,
}));

export const ClientList = ({
  clients,
  allClients,
  onChange,
}: ClientListProps) => {
  const [newClientType, setNewClientType] = useState<ClientTypeEnum>(
    ClientTypeEnum.API_DEPOT,
  );
  const [newClientId, setNewClientId] = useState("");

  const availableOptions = allClients
    .filter(({ type }) => type === newClientType)
    .map(({ clientId, name }) => ({ value: clientId, label: name ?? clientId }));

  const getClientLabel = (client: PartenaireClient) =>
    client.name || client.clientId;

  const handleAddClient = () => {
    if (!newClientId) return;
    const fullClient = allClients.find((c) => c.clientId === newClientId && c.type === newClientType);
    onChange([
      ...clients,
      {
        id: fullClient?.id,
        clientId: newClientId,
        name: fullClient?.name ?? newClientId,
        type: newClientType,
        perimeters: fullClient?.perimeters ?? [],
      } as PartenaireClient,
    ]);
    setNewClientId("");
  };

  const handleClientChange = (index: number, updated: PartenaireClient) => {
    onChange(clients.map((c, i) => (i === index ? updated : c)));
  };

  const handleClientRemove = (index: number) => {
    onChange(clients.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "1.5rem",
          border: "1px solid var(--border-default-grey)",
          borderRadius: "4px",
          padding: "1rem",
        }}
      >
        <h6 style={{ marginBottom: "1rem" }}>Ajouter un Client</h6>
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
          <div className="fr-col-3">
            <SelectInput
              label="Type de client"
              value={newClientType}
              options={clientTypeOptions}
              handleChange={(value) => {
                setNewClientType(value as ClientTypeEnum);
                setNewClientId("");
              }}
            />
          </div>
          <div className="fr-col-5">
            <SelectInput
              label="Client"
              value={newClientId}
              options={[{ value: "", label: "Sélectionnez un client" }, ...availableOptions]}
              handleChange={(value) => setNewClientId(value as string)}
            />
          </div>
          <div
            className="fr-col-4"
            style={{ display: "flex", alignItems: "flex-end", paddingBottom: "1.5rem" }}
          >
            <Button
              iconId="fr-icon-add-line"
              onClick={handleAddClient}
              type="button"
              size="small"
              disabled={!newClientId}
            >
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      <h6 style={{ marginBottom: "0.5rem" }}>Liste des applications</h6>
      {clients.length === 0 ? (
        <p className="fr-text--sm fr-text--mention-grey">
          Aucun client applicatif associé
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {clients.map((client, index) => (
            <ClientItem
              key={`${client.type}-${client.clientId}-${index}`}
              client={client}
              clientLabel={getClientLabel(client)}
              onChange={(updated) => handleClientChange(index, updated)}
              onRemove={() => handleClientRemove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
