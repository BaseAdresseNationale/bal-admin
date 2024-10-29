import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Link from "next/link";
import { ChefDeFile, Client, Mandataire } from "types/api-depot.types";
import { PartenaireDeLaChartType } from "types/partenaire-de-la-charte";

interface ClientItemProps {
  client: Client;
  mandataire: Mandataire;
  chefDeFile: ChefDeFile;
  partenaires: PartenaireDeLaChartType[];
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
        checked={client.isActive}
        disabled
      />
    </td>
    <td className="fr-col fr-my-1v">
      <input
        type="checkbox"
        id="checkbox"
        name="checkbox"
        checked={client.isRelaxMode}
        disabled
      />
    </td>
    <td className="fr-col fr-my-1v">
      {partenaires && partenaires.length > 0 ? (
        partenaires.map((partenaire) => (
          <div key={partenaire._id}>
            <Link
              legacyBehavior
              passHref
              href={{
                pathname: `/partenaires-de-la-charte/${partenaire._id}`,
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
          query: { clientId: client.id, demo: isDemo ? 1 : 0 },
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
          query: { clientId: client.id, demo: isDemo ? 1 : 0 },
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
