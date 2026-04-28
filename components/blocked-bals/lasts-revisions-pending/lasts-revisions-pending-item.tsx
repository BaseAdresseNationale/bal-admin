import RevisionValidationModal from "@/components/communes/revision-validation-popup";
import TypeClientBadge from "@/components/type-client-badge";
import { formatDate } from "@/lib/util/date";
import Link from "next/link";
import { PublicClient, LastsRevisionsPending } from "types/api-depot.types";

export const LastRevisionPendingItem = ({
  id,
  codeCommune,
  createdAt,
  legacyId,
  validation,
}: LastsRevisionsPending) => (
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
      <TypeClientBadge client={{ legacyId } as PublicClient} />
    </td>
    <td className="fr-col fr-my-1v">
      {createdAt ? formatDate(createdAt, "PPpp") : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      <RevisionValidationModal id={id} validation={validation} />
    </td>
  </tr>
);
