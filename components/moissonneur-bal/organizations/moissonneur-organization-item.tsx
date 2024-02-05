import Link from "next/link";

import Button from "@codegouvfr/react-dsfr/Button";

import { formatDate } from "@/lib/util/date";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { OrganizationMoissoneurType } from "types/moissoneur";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

const MoissoneurOrganizationItem = ({
  _id,
  name,
  page,
  perimeters,
  _deleted,
  _updated,
}: OrganizationMoissoneurType) => (
  <tr>
    <td className="fr-col fr-my-1v">{name}</td>
    <td className="fr-col fr-my-1v">
      <Link href={page} target="_blank" >
        <Button>data.gouv</Button>
      </Link>
    </td>
    <td>
    {_deleted ? (
        <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
          Supprimé
        </Badge>
      ) : perimeters && perimeters.length ? (
          <Badge severity="success" style={{ marginRight: 2, marginBottom: 2 }}>
            Activé
          </Badge>
        ) : (
          <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
            Pas de périmètre
          </Badge>
        )
      }
    </td>
    <td className="fr-col fr-my-1v">
      {_updated ? formatDate(_updated) : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        passHref
        href={{
          pathname: `/moissonneur-bal/organizations/${_id}`,
        }}
      >
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right">
          Consulter
        </Button>
      </Link>
    </td>
  </tr>
);

export default MoissoneurOrganizationItem;
