import Link from "next/link";
import { Badge } from "@codegouvfr/react-dsfr/Badge";

import type { Revision } from "../../types/api-depot.types";
import { formatDate } from "@/lib/util/date";
import MongoId from "@/components/mongo-id";
import TypeClientBadge from "../type-client-badge";
import RevisionValidationModal from "./revision-validation-popup";

export const RevisionItemApiDepot = ({
  id,
  status,
  isCurrent = false,
  client,
  validation,
  createdAt,
  publishedAt = null,
}: Revision) => (
  <tr
    key={id}
    style={
      isCurrent
        ? {
            backgroundColor: "#ababab",
            color: "black",
          }
        : undefined
    }
  >
    <td className="fr-col fr-my-1v">
      <MongoId id={id} />
    </td>
    <td className="fr-col fr-my-1v">
      <TypeClientBadge client={client} />
    </td>
    <td className="fr-col fr-my-1v">
      <Badge severity={status === "published" ? "success" : "warning"} noIcon>
        {status}
      </Badge>
    </td>
    <td className="fr-col fr-my-1v">
      <RevisionValidationModal id={id} validation={validation} />
    </td>
    <td className="fr-col fr-my-1v">
      {createdAt ? formatDate(createdAt, "PPpp") : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      {publishedAt ? formatDate(publishedAt, "PPpp") : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      {status == "published" && (
        <Link
          target="_blank"
          passHref
          href={{
            pathname: `${process.env.NEXT_PUBLIC_API_DEPOT_URL}/revisions/${id}/files/bal/download`,
          }}
        >
          Télécharger
        </Link>
      )}
    </td>
  </tr>
);
