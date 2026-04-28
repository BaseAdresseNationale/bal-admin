import Link from "next/link";
import type { Revision } from "types/api-depot.types";
import { formatDate } from "@/lib/util/date";
import TypeClientBadge from "@/components/type-client-badge";

export const RevisionsRejectedBanItem = ({
  id,
  codeCommune,
  client,
  publishedAt = null,
  publicationBan,
}: Revision & { publicationBan: React.ReactNode }) => (
  <tr>
    <td className="fr-col fr-my-1v">
      <Link passHref href={{ pathname: `/communes/${codeCommune}` }}>
        {codeCommune}
      </Link>
    </td>
    <td className="fr-col fr-my-1v">
      <TypeClientBadge client={client} />
    </td>
    <td className="fr-col fr-my-1v">
      {publishedAt ? formatDate(publishedAt, "PPpp") : "inconnu"}
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        target="_blank"
        passHref
        href={{
          pathname: `${process.env.NEXT_PUBLIC_API_DEPOT_URL}/revisions/${id}/files/bal/download`,
        }}
      >
        Télécharger
      </Link>
    </td>
    <td className="fr-col fr-my-1v">{publicationBan}</td>
  </tr>
);
