import Link from "next/link";

import Button from "@codegouvfr/react-dsfr/Button";

import { formatDate } from "@/lib/util/date";
import Badge from "@codegouvfr/react-dsfr/Badge";

interface MoissoneurSourceItemProps {
  _id: string;
  title: string;
  model: string;
  type: string;
  _deleted: boolean;
  _updated?: string;
}

const MoissoneurSourceItem = ({
  _id,
  title,
  model,
  type,
  _deleted,
  _updated,
}: MoissoneurSourceItemProps) => (
  <tr>
    <td className="fr-col fr-my-1v">{title}</td>
    <td className="fr-col fr-my-1v">{model}</td>
    <td className="fr-col fr-my-1v">{type}</td>
    <td>
      {_deleted ? (
        <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
          Supprimé
        </Badge>
      ) : (
        <Badge severity="success" style={{ marginRight: 2, marginBottom: 2 }}>
          Actif
        </Badge>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      {_updated ? formatDate(_updated) : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        passHref
        href={{
          pathname: "/moissonneur-bal/sources",
          query: { sourceId: _id },
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
