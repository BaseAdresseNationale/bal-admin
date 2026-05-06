"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Alert } from "types/alerts.types";
import { Revision } from "types/api-depot.types";
import { parseAlertMessage } from "@/lib/util/ban";

interface PublicationBanProps {
  revision: Revision;
  alerts: Alert[];
  setRevisionToSync?: () => void;
}

const getSeverity = (status: string) => {
  switch (status) {
    case "error":
      return "error";
    case "warning":
      return "warning";
    default:
      return "success";
  }
};

const getAlertType = (status: string) => {
  switch (status) {
    case "error":
      return "error";
    case "warning":
      return "warning";
    default:
      return "success";
  }
};

const publicationBanModal = createModal({
  id: "publication-ban-modal",
  isOpenedByDefault: false,
});

export const PublicationBan: React.FC<PublicationBanProps> = ({
  revision,
  alerts,
  setRevisionToSync,
}) => {
  const [status, setStatus] = useState<
    "error" | "warning" | "active" | "unknown"
  >("active");
  const [rawMessage, setRawMessage] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const determineStatus = async () => {
      const revisionAlerts = alerts.filter((a) => a.revisionId === revision.id);
      const latestAlert = revisionAlerts
        .filter(
          (alert) => alert.status === "warning" || alert.status === "error",
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];

      if (!latestAlert) {
        if (revision.isCurrent) {
          setStatus("active");
          setRawMessage("Révision synchronisée");
          setLabel("Valide");
          return;
        }
        setStatus("unknown");
        return;
      }
      // Révision courante non synchronisée
      if (latestAlert.status === "error") {
        setStatus("error");
        setRawMessage(
          latestAlert?.message ||
            "Révision courante non synchronisée avec la base",
        );
        setLabel("Erreur");
        return;
      } else if (latestAlert?.status === "warning") {
        setStatus("warning");
        setRawMessage(latestAlert?.message || "Avertissement détecté");
        setLabel("Avertissement");
      } else {
        setStatus("active");
        setRawMessage("Révision synchronisée");
        setLabel("Valide");
      }
      return;
    };

    determineStatus();
  }, [revision, alerts]);

  const displayMessage = parseAlertMessage(rawMessage);

  // Ne pas afficher si le parser retourne null pour les messages de succès
  if (
    displayMessage === null &&
    rawMessage &&
    (rawMessage.toLowerCase().includes("traité avec succès") ||
      rawMessage.toLowerCase().includes("terminé avec succès") ||
      rawMessage.toLowerCase().includes("aucun changement") ||
      rawMessage.toLowerCase().includes("liste blanche"))
  ) {
    return null;
  }

  return (
    <>
      {status !== "unknown" && (
        <>
          <Button
            priority="tertiary no outline"
            size="small"
            onClick={() => publicationBanModal.open()}
            title="Cliquer pour voir le détail"
            className="fr-p-0"
          >
            <Badge severity={getSeverity(status)}>{label}</Badge>
          </Button>
        </>
      )}
      {status === "error" && setRevisionToSync && revision.isCurrent && (
        <Button
          style={{ marginLeft: "8px" }}
          title="Synchroniser"
          iconId="ri-refresh-line"
          onClick={setRevisionToSync}
        />
      )}

      <publicationBanModal.Component title={label} size="medium">
        <div className={`fr-alert fr-alert--${getAlertType(status)}`}>
          <p style={{ whiteSpace: "pre-line" }}>
            {displayMessage || rawMessage}
          </p>
        </div>
      </publicationBanModal.Component>
    </>
  );
};
