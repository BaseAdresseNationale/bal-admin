import Link from "next/link";
import { Badge } from "@codegouvfr/react-dsfr/Badge";

import type { RevisionApiDepotType } from "../../types/api-depot";
import { formatDate } from "@/lib/util/date";
import MongoId from "@/components/mongo-id";
import Tooltip from "@/components/tooltip";
import TypeCLientBadge from "../type-client-badge";

export const RevisionItemApiDepot = ({
  _id,
  status,
  current = false,
  client,
  validation,
  createdAt,
  publishedAt = "",
}: RevisionApiDepotType) => (
  <tr key={_id}>
    <td className="fr-col fr-my-1v">
      <MongoId id={_id} />
    </td>
    <td className="fr-col fr-my-1v">
      <TypeCLientBadge client={client} />
    </td>
    <td className="fr-col fr-my-1v">
      <Badge severity={status === "published" ? "success" : "warning"} noIcon>
        {status}
      </Badge>
    </td>
    <td className="fr-col fr-my-1v">
      <input
        type="checkbox"
        id="checkbox"
        name="checkbox"
        checked={current}
        disabled
      />
    </td>
    <td className="fr-col fr-my-1v">
      {validation.valid ? (
        <input type="checkbox" id="checkbox" name="checkbox" checked disabled />
      ) : (
        <Tooltip text={validation?.errors?.join(",") || "Erreur inconnue"}>
          <input type="checkbox" id="checkbox" name="checkbox" disabled />
        </Tooltip>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      {createdAt ? formatDate(createdAt) : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      {publishedAt ? formatDate(publishedAt) : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      {status == "published" && (
        <Link
          target="_blank"
          passHref
          href={{
            pathname: `${process.env.NEXT_PUBLIC_API_DEPOT_URL}/revisions/${_id}/files/bal/download`,
          }}
        >
          Télécharger
        </Link>
      )}
    </td>
  </tr>
);
