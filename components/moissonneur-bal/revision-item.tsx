import Router from "next/router";
import Button from "@codegouvfr/react-dsfr/Button";

import MongoId from "@/components/mongo-id";
import { getFile } from "@/lib/api-moissonneur-bal";
import { getCommune } from "@/lib/cog";
import StatusBadgeRevision from "@/components/status-badge-revision";
import Badge from "@codegouvfr/react-dsfr/Badge";
import {
  RevisionMoissoneurType,
  RevisionStatusMoissoneurEnum,
} from "types/moissoneur";
import { formatDate } from "@/lib/util/date";
import { Revision } from "types/api-depot.types";
import RevisionValidationModal from "./revision-validation-popup";

interface RevisionItemProps {
  revision: RevisionMoissoneurType;
  revisionApiDepot: Revision;
  onForcePublishRevision;
  isForcePublishRevisionLoading;
}

const RevisionItem = ({
  revision,
  revisionApiDepot,
  onForcePublishRevision,
  isForcePublishRevisionLoading,
}: RevisionItemProps) => {
  const commune = getCommune(revision.codeCommune);

  const downloadFile = async () => {
    const file = await getFile(revision.fileId);
    Router.push(file.url);
  };

  const revisionIsReplaced =
    revision.publication?.status === RevisionStatusMoissoneurEnum.PUBLISHED &&
    revisionApiDepot &&
    revisionApiDepot.id !== revision.publication?.publishedRevisionId;

  const displayForcePublishButton =
    !revision.publication ||
    revision.publication?.status === RevisionStatusMoissoneurEnum.ERROR ||
    revision.publication?.status ===
      RevisionStatusMoissoneurEnum.NOT_CONFIGURED ||
    revision.publication?.status ===
      RevisionStatusMoissoneurEnum.PROVIDED_BY_OTHER_SOURCE ||
    revision.publication?.status ===
      RevisionStatusMoissoneurEnum.PROVIDED_BY_OTHER_CLIENT ||
    revisionIsReplaced;

  return (
    <tr>
      <td className="fr-col fr-my-1v">
        <a>
          {commune ? (
            commune.nom
          ) : (
            <Badge severity="error" noIcon>
              Ancienne commune
            </Badge>
          )}{" "}
          ({revision.codeCommune})
        </a>
      </td>
      <td className="fr-col fr-my-1v">
        {revision.createdAt ? formatDate(revision.createdAt) : "inconnu"}
      </td>

      <td className="fr-col fr-my-1v">
        <RevisionValidationModal
          id={revision.id}
          fileId={revision.fileId}
          validation={revision.validation}
        />
      </td>
      <td className="fr-col fr-my-1v">
        <StatusBadgeRevision
          updateStatus={revision.updateStatus}
          updateRejectionReason={revision.updateRejectionReason}
          publicationMoissoneur={revision.publication}
          revisionApiDepot={revisionApiDepot}
        />
      </td>
      <td className="fr-col fr-my-1v">
        {revision.fileId && (
          <Button
            iconId="fr-icon-download-line"
            iconPosition="right"
            onClick={downloadFile}
          >
            Télécharger
          </Button>
        )}
      </td>
      <td className="fr-col fr-my-1v">
        {displayForcePublishButton && (
          <Button
            onClick={onForcePublishRevision}
            disabled={isForcePublishRevisionLoading}
          >
            {isForcePublishRevisionLoading
              ? "Publication..."
              : revisionIsReplaced
                ? "Republier"
                : "Forcer la publication"}
          </Button>
        )}
      </td>
    </tr>
  );
};

export default RevisionItem;
