import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import styled from "styled-components";
import { Validation } from "types/api-depot.types";

const StyledWrapper = styled.div`
  .header {
    display: flex;
    margin-bottom: 1rem;
  }
`;

interface RevisionValidationReportProps {
  validationReport: Validation;
}

export default function RevisionValidationReport({
  validationReport,
}: RevisionValidationReportProps) {
  return validationReport ? (
    <StyledWrapper>
      <div className="header">
        <div>
          Statut :{" "}
          {validationReport.valid ? (
            <Badge severity="success">Valide</Badge>
          ) : (
            <Badge severity="error">Invalide</Badge>
          )}
        </div>
      </div>
      <p>
        Nombre de lignes dans le fichier BAL :{" "}
        <b>{validationReport.rowsCount}</b>
      </p>
      <Alert
        severity="error"
        title={`Erreur(s) bloquante(s) : ${validationReport.errors?.length}`}
        description={
          <ul>
            {validationReport.errors?.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        }
      />
      <Alert
        severity="warning"
        title={`Avertissement(s) : ${validationReport.warnings?.length}`}
        description={
          <ul>
            {validationReport.warnings?.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        }
      />
      <Alert
        severity="info"
        title={`Information(s) : ${validationReport.infos?.length}`}
        description={
          <ul>
            {validationReport.infos?.map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        }
      />
    </StyledWrapper>
  ) : null;
}
