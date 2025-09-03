import Link from "next/link";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";

import type { BaseLocaleType } from "../../types/mes-adresses";
import { computeStatus } from "@/lib/bal-status";
import { formatDate } from "@/lib/util/date";

export const BalsItem = (
  item: BaseLocaleType,
  actions: Record<string, (item: BaseLocaleType) => void>
) => {
  const { id, nom, status, sync, emails, createdAt, updatedAt } = item;

  const computedStatus = computeStatus(status, sync);

  return (
    <tr key={id}>
      <td className="fr-col fr-my-1v">{id}</td>
      <td className="fr-col fr-my-1v">{nom}</td>
      <td className="fr-col fr-my-1v">
        <Badge severity={computedStatus?.intent} noIcon>
          {computedStatus?.label}
        </Badge>
      </td>
      <td className="fr-col fr-my-1v">
        {createdAt ? formatDate(createdAt) : "inconnu"}
      </td>
      <td className="fr-col fr-my-1v">
        {updatedAt ? formatDate(updatedAt) : "inconnu"}
      </td>
      <td className="fr-col fr-my-1v">
        {emails ? emails.join("\n") : "inconnu"}
      </td>
      <td className="fr-col fr-my-1v">
        <Link
          passHref
          href={{
            pathname: "/mes-adresses/base-locale",
            query: { baseLocaleId: id },
          }}
        >
          <Button iconId="fr-icon-arrow-right-line" iconPosition="right">
            Consulter
          </Button>
        </Link>
      </td>
      <td>
        <Button
          onClick={() => {
            actions.delete(item);
          }}
        >
          Supprimer
        </Button>
      </td>
    </tr>
  );
};
