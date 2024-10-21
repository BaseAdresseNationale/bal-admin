import Link from "next/link";

import Button from "@codegouvfr/react-dsfr/Button";

import { formatDate } from "@/lib/util/date";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { ExtendedSourceMoissoneurType } from "types/moissoneur";

const MoissoneurSourceItem = ({
  id,
  title,
  enabled,
  deletedAt,
  updatedAt,
  harvestError,
  nbRevisionError,
}: ExtendedSourceMoissoneurType) => (
  <tr>
    <td className="fr-col fr-my-1v">{id}</td>
    <td className="fr-col fr-my-1v">{title}</td>
    <td>
      {deletedAt ? (
        <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
          Supprimé
        </Badge>
      ) : enabled ? (
        <Badge severity="success" style={{ marginRight: 2, marginBottom: 2 }}>
          Activé
        </Badge>
      ) : (
        <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
          Désactivé
        </Badge>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      {updatedAt ? formatDate(updatedAt) : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      {harvestError && (
        <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
          Erreur
        </Badge>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      {nbRevisionError > 0 && (
        <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
          {nbRevisionError} Révision(s) erreur(s)
        </Badge>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        passHref
        href={{
          pathname: `/moissonneur-bal/sources/${id}`,
        }}
      >
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right">
          Consulter
        </Button>
      </Link>
    </td>
  </tr>
);

export default MoissoneurSourceItem;
