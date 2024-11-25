import React from "react";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Link from "next/link";
import {
  PartenaireDeLaCharte,
  PartenaireDeLaCharteTypeEnum,
} from "../../server/lib/partenaire-de-la-charte/entity";

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

const getDate = (signatureDate: Date, creationDate: Date) => {
  if (signatureDate) {
    return new Date(signatureDate).toLocaleDateString();
  }

  return new Date(creationDate).toLocaleDateString();
};

export const PartenaireItem = ({
  id,
  createdAt,
  type,
  name,
  signatureDate,
  services,
  dataGouvOrganizationId,
  apiDepotClientId,
}: PartenaireDeLaCharte) => (
  <tr key={id}>
    <td className="fr-col fr-my-1v">
      <Badge severity={getPartenaireTypeColor(type)} noIcon>
        {type}
      </Badge>
    </td>
    <td className="fr-col fr-my-1v">{name}</td>
    <td className="fr-col fr-my-1v">{getDate(signatureDate, createdAt)}</td>
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
      {dataGouvOrganizationId?.length > 0 && (
        <Badge severity="info" noIcon>
          {dataGouvOrganizationId?.length} organisation(s) moissonnée(s)
        </Badge>
      )}
      {apiDepotClientId?.length > 0 && (
        <Badge severity="new" noIcon>
          {apiDepotClientId.length} Client(s) api-depot
        </Badge>
      )}
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        legacyBehavior
        passHref
        href={{
          pathname: `/partenaires-de-la-charte/${id}`,
        }}
      >
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right">
          Consulter
        </Button>
      </Link>
    </td>
  </tr>
);
