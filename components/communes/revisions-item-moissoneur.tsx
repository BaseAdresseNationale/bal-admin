import Link from "next/link";

import type { RevisionMoissoneurType } from "../../types/moissoneur";
import { formatDate } from "@/lib/util/date";
import StatusBadgeRevision from "../status-badge-revision";

export const RevisionItemMoissoneur = ({
  id,
  sourceId,
  sourceName,
  validation,
  createdAt,
  updateStatus,
  updateRejectionReason,
  publication,
}: RevisionMoissoneurType) => (
  <tr key={id}>
    <td className="fr-col fr-my-1v">
      <Link
        legacyBehavior
        passHref
        href={{ pathname: `/moissonneur-bal/sources/${sourceId}` }}
      >
        <a className="truncate-link">{sourceName}</a>
      </Link>
    </td>
    <td className="fr-col fr-my-1v">
      {createdAt ? formatDate(createdAt, "PPpp") : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      {validation.nbRows} / {validation.nbRowsWithErrors}
    </td>
    <td className="fr-col fr-my-1v">
      <StatusBadgeRevision
        updateStatus={updateStatus}
        updateRejectionReason={updateRejectionReason}
        publicationMoissoneur={publication}
      />
    </td>
    <style jsx>{`
      .truncate-link:not(:hover) {
        display: inline-block;
        max-width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: bottom;
      }
    `}</style>
  </tr>
);
