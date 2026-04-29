import RevisionValidationModal from "@/components/communes/revision-validation-popup";
import TypeClientBadge from "@/components/type-client-badge";
import { formatDate } from "@/lib/util/date";
import Link from "next/link";
import { Revision } from "types/api-depot.types";

export const BLockedRevisionItem = ({
  id,
  codeCommune,
  createdAt,
  client,
  files,
  validation,
}: Revision) => (
  <tr key={codeCommune}>
    <td className="fr-col fr-my-1v">
      <Link
        passHref
        href={{
          pathname: `/communes/${codeCommune}`,
        }}
      >
        {codeCommune}
      </Link>
    </td>
    <td className="fr-col fr-my-1v">
      {client && <TypeClientBadge client={client} />}
    </td>
    <td className="fr-col fr-my-1v">
      {createdAt ? formatDate(createdAt, "PPpp") : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      {files && files.length > 0 && (
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
    <td className="fr-col fr-my-1v">
      <RevisionValidationModal id={id} validation={validation} />
    </td>
  </tr>
);
