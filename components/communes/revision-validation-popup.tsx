import { Validation } from "../../types/api-depot.types";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import RevisionValidationReport from "./revision-validation-report";
import { Button } from "@codegouvfr/react-dsfr/Button";

type RevisionValidationModalProps = {
  id: string;
  validation: Validation | null;
};

const RevisionValidationModal = ({
  id,
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
          <RevisionValidationReport id={id} validationReport={validation} />
        </modal.Component>
        <Button
          iconId={
            validation.valid ? "fr-icon-check-line" : "fr-icon-alert-line"
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
