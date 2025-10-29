"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "types/alerts.types";
import { Revision } from "types/api-depot.types";
import { parseAlertMessage } from "@/lib/util/ban";

interface PublicationBanProps {
  revision: Revision;
  alerts: Alert[];
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

export const PublicationBan: React.FC<PublicationBanProps> = ({
  revision,
  alerts,
}) => {
  const [status, setStatus] = useState<
    "error" | "warning" | "active" | "unknown"
  >("active");
  const [rawMessage, setRawMessage] = useState("");
  const [label, setLabel] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const determineStatus = async () => {
      const revisionAlerts = alerts.filter((a) => a.revisionId === revision.id);
      const latestAlert = revisionAlerts
        .filter(
          (alert) => alert.status === "warning" || alert.status === "error"
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
            "Révision courante non synchronisée avec la base"
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".custom-modal") && !target.closest("button")) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showModal]);

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
        <Button
          priority="tertiary no outline"
          size="small"
          onClick={() => setShowModal(!showModal)}
          title="Cliquer pour voir le détail"
          className="fr-p-0"
        >
          <Badge severity={getSeverity(status)}>{label}</Badge>
        </Button>
      )}

      {showModal && (
        <div
          className="fr-modal fr-modal--opened custom-modal"
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translateY(-50%) translateX(-50%)",
            maxWidth: "600px",
            width: "auto",
            zIndex: 1000,
            background: "transparent",
          }}
        >
          <div
            className="fr-modal__content"
            style={{
              background: "var(--background-default-grey-hover)",
              padding: "0",
            }}
          >
            <div
              className={`fr-alert fr-alert--${getAlertType(status)}`}
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <button
                className="fr-btn--close fr-btn"
                title="Fermer"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>
              <div
                className="fr-alert__title"
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  whiteSpace: "pre-line",
                }}
              >
                {displayMessage || rawMessage}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
