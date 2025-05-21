import { Badge } from "@codegouvfr/react-dsfr/Badge";

import type { PublicationMoissoneurType } from "../types/moissoneur";
import { RevisionStatusMoissoneurEnum } from "../types/moissoneur";
import Tooltip from "./tooltip";
import { Revision } from "types/api-depot.types";

export interface RevisionPublicationProps {
  publicationMoissoneur: PublicationMoissoneurType;
  revisionApiDepot?: Revision;
}

export const RevisionPublication = ({
  publicationMoissoneur,
  revisionApiDepot,
}: RevisionPublicationProps) => {
  const { status, errorMessage, currentSourceId, currentClientId } =
    publicationMoissoneur;
  if (status === RevisionStatusMoissoneurEnum.PROVIDED_BY_OTHER_CLIENT) {
    return (
      <Tooltip text={currentClientId || "inconnu"}>
        <Badge severity="warning" noIcon>
          Publiée par un autre client
        </Badge>
      </Tooltip>
    );
  }

  if (status === RevisionStatusMoissoneurEnum.PROVIDED_BY_OTHER_SOURCE) {
    return (
      <Tooltip text={currentSourceId || "inconnue"}>
        <Badge severity="error" noIcon>
          Publiée par une autre source
        </Badge>
      </Tooltip>
    );
  }

  if (status === RevisionStatusMoissoneurEnum.PUBLISHED) {
    if (
      revisionApiDepot &&
      revisionApiDepot.id !== publicationMoissoneur.publishedRevisionId
    ) {
      return (
        <Badge severity="info" noIcon>
          Remplacée par {revisionApiDepot.client.nom}
        </Badge>
      );
    }
    return (
      <Badge severity="success" noIcon>
        Publiée
      </Badge>
    );
  }

  if (status === RevisionStatusMoissoneurEnum.ERROR) {
    return (
      <Tooltip text={errorMessage}>
        <Badge severity="error" noIcon>
          Erreur
        </Badge>
      </Tooltip>
    );
  }

  return <Badge noIcon>Non publiée</Badge>;
};
