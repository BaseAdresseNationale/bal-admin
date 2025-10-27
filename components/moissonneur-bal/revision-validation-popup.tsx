import { createModal } from "@codegouvfr/react-dsfr/Modal";
import RevisionValidationReport from "./revision-validation-report";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { ValidationMoissonneurType } from "types/moissoneur";

type RevisionValidationModalProps = {
  id: string;
  fileId: string;
  validation: ValidationMoissonneurType | null;
};

const RevisionValidationModal = ({
  id,
  fileId,
  validation,
}: RevisionValidationModalProps) => {
  const modal = createModal({
    id: `validation-report-modal-${id}`,
    isOpenedByDefault: false,
  });

  if (validation) {
    return (
      <>
        <modal.Component title="Rapport de validation">
          <RevisionValidationReport
            id={id}
            fileId={fileId}
            validation={validation}
          />
        </modal.Component>
        <Button
          iconId={
            validation.nbRowsWithErrors <= 0
              ? "fr-icon-check-line"
              : "fr-icon-alert-line"
          }
          iconPosition="right"
          onClick={() => modal.open()}
        >
          Ouvrir
        </Button>
      </>
    );
  }
};

export default RevisionValidationModal;
