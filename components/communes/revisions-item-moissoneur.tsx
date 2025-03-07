import Link from "next/link";

import type { RevisionMoissoneurType } from "../../types/moissoneur";
import UpdateStatusBadge from "@/components/update-status-badge";
import { RevisionPublication } from "@/components/revision-publication";
import MongoId from "@/components/mongo-id";
import Tooltip from "@/components/tooltip";
import { formatDate } from "@/lib/util/date";

export const RevisionItemMoissoneur = ({
  id,
  sourceId,
  validation,
  createdAt,
  updateStatus,
  updateRejectionReason,
  publication,
}: RevisionMoissoneurType) => (
  <tr key={id}>
    <td className="fr-col fr-my-1v">
      <MongoId id={id} />
    </td>
    <td className="fr-col fr-my-1v">
      <Tooltip text={sourceId}>
        <Link
          legacyBehavior
          passHref
          href={{ pathname: `/moissonneur-bal/sources/${sourceId}` }}
        >
          {sourceId}
        </Link>
      </Tooltip>
    </td>
    <td className="fr-col fr-my-1v">
      {createdAt ? formatDate(createdAt) : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">{validation.nbRows}</td>
    <td className="fr-col fr-my-1v">{validation.nbRowsWithErrors}</td>

    <td className="fr-col fr-my-1v">
      <UpdateStatusBadge
        updateStatus={updateStatus}
        updateRejectionReason={updateRejectionReason}
      />
    </td>
    <td className="fr-col fr-my-1v">
      <RevisionPublication {...publication} />
    </td>
  </tr>
);
