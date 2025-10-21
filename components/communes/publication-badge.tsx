import Tooltip from "@/components/tooltip";
import { Validation } from "../../types/api-depot.types";
import { fr } from "@codegouvfr/react-dsfr";

type PublicationBadgeProps = {
  validation: Validation | null;
};

const PublicationBadge = ({ validation }: PublicationBadgeProps) => {
  if (validation) {
    if (validation.valid) {
      return <i className={fr.cx("fr-icon-check-line")} />;
    }
    return (
      <Tooltip text={validation?.errors?.join(",") || "Erreur inconnue"}>
        <i className={fr.cx("fr-icon-alert-line")} />
      </Tooltip>
    );
  }
};

export default PublicationBadge;
