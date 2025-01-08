import { Badge } from "@codegouvfr/react-dsfr/Badge";

import { UpdateStatusEnum } from "../types/moissoneur";
import Tooltip from "./tooltip";
import { ClientApiDepotType } from "types/api-depot";
import Link from "next/link";
import { useMemo } from "react";

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

type TypeCLientBadgeProps = {
  client: ClientApiDepotType;
};

const TypeCLientBadge = ({ client }: TypeCLientBadgeProps) => {
  const getBadge = useMemo(() => {
    if (
      client.id === "mes-adresses" ||
      client.id === "moissonneur-bal" ||
      client.id === "formulaire-publication"
    ) {
      return (
        <Badge
          severity={ClientIdToBadge[client.id].severity}
          noIcon
          style={{ cursor: "pointer" }}
        >
          {ClientIdToBadge[client.id].text}
        </Badge>
      );
    }

    return (
      <Badge severity="new" noIcon style={{ cursor: "pointer" }}>
        API DEPOT
      </Badge>
    );
  }, [client.id]);

  return (
    <Link
      legacyBehavior
      passHref
      href={{
        pathname: "/api-depot/client",
        query: { clientId: client._id },
      }}
    >
      {getBadge}
    </Link>
  );
};

export default TypeCLientBadge;
