import Link from "next/link";
import Button from "@codegouvfr/react-dsfr/Button";
import Badge from "@codegouvfr/react-dsfr/Badge";

import CopyToClipBoard from "@/components/copy-to-clipboard";
import { ClientApiDepotType } from "types/api-depot";
import { PartenaireDeLaCharte } from "../../../server/lib/partenaire-de-la-charte/entity";

interface ClientHeaderProps {
  client: ClientApiDepotType;
  partenaire: PartenaireDeLaCharte;
}

const ClientHeader = ({ client, partenaire }: ClientHeaderProps) => (
  <div className="fr-py-4v">
    <h1 className="fr-m-1v">Client</h1>
    <div className="fr-container fr-py-4v">
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-10">
          <h2>{client.nom}</h2>
          <CopyToClipBoard text={client._id} title="Id" />
          <CopyToClipBoard text={client.token} title="Token" />

          {partenaire ? (
            <>
              <h3>Partenaire de la charte</h3>
              <Link
                legacyBehavior
                passHref
                href={{
                  pathname: `/partenaires-de-la-charte/${partenaire.id}`,
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
