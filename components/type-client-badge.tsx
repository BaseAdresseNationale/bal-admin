import { Badge } from "@codegouvfr/react-dsfr/Badge";

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
      client.legacyId === "moissonneur-bal" ||
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
    }

    return (
      <Badge severity="new" noIcon style={{ cursor: "pointer" }}>
        API DEPOT
      </Badge>
    );
  }, [client.legacyId]);

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
