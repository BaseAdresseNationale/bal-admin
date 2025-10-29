import Router from "next/router";

import Button from "@codegouvfr/react-dsfr/Button";

import { formatDate } from "@/lib/util/date";
import { getFile } from "@/lib/api-moissonneur-bal";

import StatusBadgeHarvest from "@/components/status-badge-harvest";
import { HarvestMoissonneurType } from "types/moissoneur";

const HarvestItem = ({
  id,
  startedAt,
  finishedAt,
  status,
  error,
  updateStatus,
  updateRejectionReason,
  fileId,
}: HarvestMoissonneurType) => {
  const downloadFile = async () => {
    const file = await getFile(fileId);
    Router.push(file.url);
  };

  return (
    <tr>
      <td className="fr-col fr-my-1v">
        <a>{formatDate(startedAt)}</a>
      </td>
      <td className="fr-col fr-my-1v">
        <a>{finishedAt ? formatDate(finishedAt) : "…"}</a>
      </td>
      <td className="fr-col fr-my-1v">
        <StatusBadgeHarvest
          status={status}
          error={error}
          updateStatus={updateStatus}
          updateRejectionReason={updateRejectionReason}
        />
      </td>
      <td className="fr-col fr-my-1v">
        {fileId && (
          <Button
            iconId="fr-icon-download-line"
            iconPosition="right"
            onClick={downloadFile}
          >
            Télécharger
          </Button>
        )}
      </td>
    </tr>
  );
};

export default HarvestItem;
