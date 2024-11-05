import React from "react";
import { Event, EventTypeEnum } from "../../server/lib/events/entity";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Link from "next/link";

const getEventTypeColor = (type: EventTypeEnum) => {
  switch (type) {
    case EventTypeEnum.FORMATION:
      return "rgb(15, 111, 0)";
    case EventTypeEnum.FORMATION_LVL2:
      return "rgb(3, 189, 91)";
    case EventTypeEnum.PARTENAIRE:
      return "rgb(0, 83, 179)";
    case EventTypeEnum.ADRESSE_LAB:
      return "rgb(209, 51, 91)";
    case EventTypeEnum.ADRESSE_REGION:
      return "rgb(130, 0, 191)";
    case EventTypeEnum.PRESENTATION:
      return "rgb(26, 168, 255)";
    default:
      return "black";
  }
};

const getDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

const getHours = (startHour: string, endHour: string) => {
  return `${startHour.replace(":", "h")} à ${endHour.replace(":", "h")}`;
};

export const EventItem = ({
  id,
  type,
  title,
  date,
  startHour,
  endHour,
}: Event) => (
  <tr key={id}>
    <td className="fr-col fr-my-1v">
      <Badge
        style={{ background: getEventTypeColor(type), color: "white" }}
        noIcon
      >
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
          pathname: `/events/${id}`,
        }}
      >
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right">
          Consulter
        </Button>
      </Link>
    </td>
    <td className="fr-col fr-my-1v">
      <Link
        passHref
        href={{
          pathname: `/events/new`,
          query: {
            duplicatEvent: id,
          },
        }}
      >
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right">
          Dupliquer
        </Button>
      </Link>
    </td>
  </tr>
);
