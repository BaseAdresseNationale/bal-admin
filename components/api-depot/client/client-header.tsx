import Link from "next/link";
import Button from "@codegouvfr/react-dsfr/Button";
import Badge from "@codegouvfr/react-dsfr/Badge";

import CopyToClipBoard from "@/components/copy-to-clipboard";
import { Client } from "types/api-depot.types";
import { PartenaireDeLaChartType } from "types/partenaire-de-la-charte";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

interface ClientHeaderProps {
  client: Client;
  partenaire: PartenaireDeLaChartType;
}

const ClientHeader = ({ client, partenaire }: ClientHeaderProps) => (
  <div className="fr-py-4v">
    <h1 className="fr-m-1v">Client</h1>
    <div className="fr-container fr-py-4v">
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-10">
          <h2>{client.nom}</h2>
          <CopyToClipBoard text={client.id} title="Id" />
          <CopyToClipBoard text={client.token} title="Token" />

          <Checkbox
            state={client.isActive ? "success" : "error"}
            options={[
              {
                label: "Activé",
                nativeInputProps: {
                  value: "value1",
                  checked: client.isActive,
                  readOnly: true,
                },
              },
            ]}
          />
          <Checkbox
            state={client.isRelaxMode ? "success" : "error"}
            options={[
              {
                label: "Mode relax",
                nativeInputProps: {
                  value: "value1",
                  checked: client.isRelaxMode,
                  readOnly: true,
                },
              },
            ]}
          />

          {partenaire ? (
            <>
              <h3>Partenaire de la charte</h3>
              <Link
                legacyBehavior
                passHref
                href={{
                  pathname: `/partenaires-de-la-charte/${partenaire._id}`,
                }}
              >
                <Button priority="secondary">{partenaire.name}</Button>
              </Link>
            </>
          ) : (
            <Badge severity="warning">Non partenaire</Badge>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ClientHeader;
