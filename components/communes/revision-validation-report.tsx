"use client";

import { getLabel } from "@ban-team/validateur-bal";
import Link from "next/link";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";

import { Validation } from "types/api-depot.types";

interface RevisionValidationReportProps {
  id: string;
  validationReport: Validation;
}

export default function RevisionValidationReport({
  id,
  validationReport,
}: RevisionValidationReportProps) {
  return (
    <div>
      <div className="header" style={{ marginBottom: "1rem" }}>
        <p>
          Statut :{" "}
          {validationReport.valid ? (
            <Badge severity="success">Valide</Badge>
          ) : (
            <Badge severity="error">Invalide</Badge>
          )}
        </p>
        <p>
          Nombre de lignes dans le fichier BAL :{" "}
          <b>{validationReport.rowsCount}</b>
        </p>
        <Link
          target="_blank"
          passHref
          href={`${process.env.NEXT_PUBLIC_ADRESSES_URL}/outils/validateur-bal?file=${process.env.NEXT_PUBLIC_API_DEPOT_URL}/revisions/${id}/files/bal/download`}
        >
          Lien vers le validateur BAL
        </Link>
      </div>
      {validationReport.errors && (
        <Alert
          severity="error"
          title={`Erreur(s) bloquante(s) : ${validationReport.errors.length}`}
          description={
            <ul>
              {validationReport.errors.map((error, index) => (
                <li key={index}>{getLabel(error)}</li>
              ))}
            </ul>
          }
        />
      )}
      {validationReport.warnings && (
        <Alert
          severity="warning"
          title={`Avertissement(s) : ${validationReport.warnings.length}`}
          description={
            <ul>
              {validationReport.warnings.map((warning, index) => (
                <li key={index}>{getLabel(warning)}</li>
              ))}
            </ul>
          }
        />
      )}

      {validationReport.infos && (
        <Alert
          severity="info"
          title={`Information(s) : ${validationReport.infos.length}`}
          description={
            <ul>
              {validationReport.infos.map((info, index) => (
                <li key={index}>{getLabel(info)}</li>
              ))}
            </ul>
          }
        />
      )}
    </div>
  );
}
