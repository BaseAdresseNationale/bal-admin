import React from "react";
import type { PartenaireDeLaChartType } from "types/partenaire-de-la-charte";
import { PartenaireDeLaCharteTypeEnum } from "types/partenaire-de-la-charte";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Link from "next/link";

const getPartenaireTypeColor = (type: PartenaireDeLaCharteTypeEnum) => {
  switch (type) {
    case PartenaireDeLaCharteTypeEnum.COMMUNE:
      return "new";
    case PartenaireDeLaCharteTypeEnum.ORGANISME:
      return "warning";
    default:
      return "success";
  }
};

const getDate = (signatureDate: string, creationDate: string) => {
  if (signatureDate) {
    return new Date(signatureDate).toLocaleDateString();
  }

  return new Date(creationDate).toLocaleDateString();
};

export const PartenaireItem = ({
  _id,
  _created,
  type,
  name,
  signatureDate,
  services,
  dataGouvOrganizationId,
  apiDepotClientId,
}: PartenaireDeLaChartType) => (
  <tr key={_id}>
    <td className="fr-col fr-my-1v">
      <Badge severity={getPartenaireTypeColor(type)} noIcon>
        {type}
      </Badge>
    </td>
    <td className="fr-col fr-my-1v">{name}</td>
    <td className="fr-col fr-my-1v">{getDate(signatureDate, _created)}</td>
    <td className="fr-col fr-my-1v">
      {services?.map((service) => (
        <Badge
          severity="info"
          style={{ marginRight: 2, marginBottom: 2 }}
          key={service}
        >
          {service}
        </Badge>
      ))}
    </td>
    <td className="fr-col fr-my-1v">
      {dataGouvOrganizationId && (
        <Link
          legacyBehavior
          passHref
          href={{
            pathname: `/moissonneur-bal/organizations/${dataGouvOrganizationId}`,
          }}
        >
          <Button priority="secondary">Moissonneur</Button>
        </Link>
      )}
      {apiDepotClientId && (
        <Link
          legacyBehavior
          passHref
          href={{
            pathname: `/api-depot/client`,
            query: { clientId: apiDepotClientId },
          }}
        >
          <Button priority="secondary">Api depot</Button>
        </Link>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        legacyBehavior
        passHref
        href={{
          pathname: `/partenaires-de-la-charte/${_id}`,
        }}
      >
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right">
          Consulter
        </Button>
      </Link>
    </td>
  </tr>
);
