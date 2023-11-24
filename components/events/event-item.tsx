import React from "react";
import type { EventType } from "types/event";
import { EventTypeTypeEnum } from "types/event";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Link from "next/link";

const getEventTypeColor = (type: EventTypeTypeEnum) => {
  switch (type) {
    case EventTypeTypeEnum.FORMATION:
      return "new";
    case EventTypeTypeEnum.PARTENAIRE:
      return "warning";
    case EventTypeTypeEnum.ADRESSE_LAB:
      return "info";
    default:
      return "success";
  }
};

const getDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const getHours = (startHour: string, endHour: string) => {
  return `${startHour} - ${endHour}`;
};

export const EventItem = ({
  _id,
  type,
  title,
  date,
  startHour,
  endHour,
}: EventType) => (
  <tr key={_id}>
    <td className="fr-col fr-my-1v">
      <Badge severity={getEventTypeColor(type)} noIcon>
        {type}
      </Badge>
    </td>
    <td className="fr-col fr-my-1v">{title}</td>
    <td className="fr-col fr-my-1v">{getDate(date)}</td>
    <td className="fr-col fr-my-1v">{getHours(startHour, endHour)}</td>
    <td className="fr-col fr-my-1v">
      <Link
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
