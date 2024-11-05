import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Link from "next/link";
import { PartenaireDeLaCharte } from "../../server/lib/partenaire-de-la-charte/entity";
import {
  ChefDeFileApiDepotType,
  ClientApiDepotType,
  MandataireApiDepotType,
} from "types/api-depot";

interface ClientItemProps {
  client: ClientApiDepotType;
  mandataire: MandataireApiDepotType;
  chefDeFile: ChefDeFileApiDepotType;
  partenaires: PartenaireDeLaCharte[];
  isDemo: boolean;
}

const ClientItem = ({
  client,
  mandataire,
  chefDeFile,
  partenaires,
  isDemo,
}: ClientItemProps) => (
  <tr>
    <td className="fr-col fr-my-1v">{client.nom}</td>
    <td className="fr-col fr-my-1v">{mandataire.nom}</td>
    <td className="fr-col fr-my-1v">{chefDeFile ? chefDeFile.nom : "-"}</td>
    <td className="fr-col fr-my-1v">{client.authorizationStrategy}</td>
    <td className="fr-col fr-my-1v">
      <input
        type="checkbox"
        id="checkbox"
        name="checkbox"
        checked={client.active}
        disabled
      />
    </td>
    <td className="fr-col fr-my-1v">
      <input
        type="checkbox"
        id="checkbox"
        name="checkbox"
        checked={client.options.relaxMode}
        disabled
      />
    </td>
    <td className="fr-col fr-my-1v">
      {partenaires && partenaires.length > 0 ? (
        partenaires.map((partenaire) => (
          <div key={partenaire.id}>
            <Link
              legacyBehavior
              passHref
              href={{
                pathname: `/partenaires-de-la-charte/${partenaire.id}`,
              }}
            >
              {partenaire.name}
            </Link>
          </div>
        ))
      ) : (
        <Badge severity="warning">Non partenaire</Badge>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        legacyBehavior
        passHref
        href={{
          pathname: "/api-depot/client/client-form",
          query: { clientId: client._id, demo: isDemo ? 1 : 0 },
        }}
      >
        <Button iconId="fr-icon-edit-line" iconPosition="right">
          Editer
        </Button>
      </Link>
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        legacyBehavior
        passHref
        href={{
          pathname: "/api-depot/client",
          query: { clientId: client._id, demo: isDemo ? 1 : 0 },
        }}
      >
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right">
          Consulter
        </Button>
      </Link>
    </td>
  </tr>
);

export default ClientItem;
