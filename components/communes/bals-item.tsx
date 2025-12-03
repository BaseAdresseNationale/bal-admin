import Link from "next/link";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";

import type { BaseLocaleType } from "../../types/mes-adresses";
import { computeStatus } from "@/lib/bal-status";
import { formatDate } from "@/lib/util/date";

export const BalsItem = (
  item: BaseLocaleType,
  actions: Record<string, (item: BaseLocaleType) => void>,
  selectedItem?: string
) => {
  const {
    id,
    nom,
    status,
    sync,
    emails,
    createdAt,
    updatedAt,
    nbNumeros,
    nbNumerosCertifies,
  } = item;

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
        {nbNumeros} / {nbNumerosCertifies}
      </td>
      <td className="fr-col fr-my-1v">
        <div style={{ width: "150px" }}>
          <Button
            title="Sélectionner"
            className="fr-col-4 fr-m-1v"
            iconId={
              selectedItem === id
                ? "fr-icon-cursor-fill"
                : "fr-icon-cursor-line"
            }
            onClick={() => {
              actions.select(item);
            }}
          />
          <Button
            title="Supprimer"
            className="fr-col-4 fr-m-1v"
            iconId="fr-icon-delete-bin-fill"
            onClick={() => {
              actions.delete(item);
            }}
          />
          <Link
            className="fr-col-4 fr-m-1v"
            passHref
            href={{
              pathname: "/mes-adresses/base-locale",
              query: { baseLocaleId: id },
            }}
          >
            <Button
              title="Consulter"
              iconId="fr-icon-arrow-right-line"
              priority="secondary"
            />
          </Link>
        </div>
      </td>
    </tr>
  );
};
