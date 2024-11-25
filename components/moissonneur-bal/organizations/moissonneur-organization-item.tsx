import Link from "next/link";

import Button from "@codegouvfr/react-dsfr/Button";

import { formatDate } from "@/lib/util/date";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { OrganizationBalAdminType } from "types/moissoneur";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

const MoissoneurOrganizationItem = ({
  id,
  name,
  page,
  perimeters,
  updatedAt,
  deletedAt,
  partenaire,
}: OrganizationBalAdminType) => (
  <tr>
    <td className="fr-col fr-my-1v">{name}</td>
    <td className="fr-col fr-my-1v">
      <Link legacyBehavior passHref href={page} target="_blank">
        <Button>data.gouv</Button>
      </Link>
    </td>
    <td>
      {deletedAt ? (
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
      )}
    </td>
    <td className="fr-col fr-my-1v">
      {partenaire ? (
        <Link
          legacyBehavior
          passHref
          href={{
            pathname: `/partenaires-de-la-charte/${partenaire.id}`,
          }}
        >
          {partenaire.name}
        </Link>
      ) : (
        <Badge severity="warning">Non partenaire</Badge>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      {updatedAt ? formatDate(updatedAt) : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        passHref
        href={{
          pathname: `/moissonneur-bal/organizations/${id}`,
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
