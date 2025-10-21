import { Badge } from "@codegouvfr/react-dsfr/Badge";
import Tooltip from "@/components/tooltip";

import Link from "next/link";
import { useMemo } from "react";
import { PublicClient } from "types/api-depot.types";

const ClientIdToBadge = {
  "mes-adresses": {
    severity: "info",
    text: "MES ADRESSES",
  },
  "moissonneur-bal": {
    severity: "warning",
    text: "MOISSONNEUR",
  },
  "formulaire-publication": {
    severity: undefined,
    text: "FORMULAIRE PUBLICATION",
  },
};

type TypeClientBadgeProps = {
  client: PublicClient;
};

const TypeClientBadge = ({ client }: TypeClientBadgeProps) => {
  const getBadge = useMemo(() => {
    if (
      client.legacyId === "mes-adresses" ||
      client.legacyId === "formulaire-publication"
    ) {
      return (
        <Badge
          severity={ClientIdToBadge[client.legacyId].severity}
          noIcon
          style={{ cursor: "pointer" }}
        >
          {ClientIdToBadge[client.legacyId].text}
        </Badge>
      );
    } else if (client.legacyId === "moissonneur-bal") {
      return (
        <Tooltip text={client.sourceName || "inconnue"} width="200px">
          <Badge severity="warning" noIcon style={{ cursor: "pointer" }}>
            MOISSONNEUR
          </Badge>
        </Tooltip>
      );
    }

    return (
      <Tooltip text={client.nom || "inconnue"} width="200px">
        <Badge severity="new" noIcon style={{ cursor: "pointer" }}>
          API DEPOT
        </Badge>
      </Tooltip>
    );
  }, [client.legacyId, client.sourceName, client.nom]);

  return (
    <Link
      legacyBehavior
      passHref
      href={{
        pathname: "/api-depot/client",
        query: { clientId: client.id },
      }}
    >
      {getBadge}
    </Link>
  );
};

export default TypeClientBadge;
