import React from "react";
import type { EventType } from "types/event";
import { EventTypeTypeEnum } from "types/event";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Link from "next/link";

const getEventTypeColor = (type: EventTypeTypeEnum) => {
  switch (type) {
    case EventTypeTypeEnum.FORMATION:
      return "rgb(15, 111, 0)";
    case EventTypeTypeEnum.FORMATION_LVL2:
      return "rgb(3, 189, 91)";
    case EventTypeTypeEnum.PARTENAIRE:
      return "rgb(0, 83, 179)";
    case EventTypeTypeEnum.ADRESSE_LAB:
      return "rgb(209, 51, 91)";
    case EventTypeTypeEnum.ADRESSE_REGION:
      return "rgb(130, 0, 191)";
    case EventTypeTypeEnum.PRESENTATION:
      return "rgb(26, 168, 255)";
    default:
      return "black";
  }
};

const getDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const getHours = (startHour: string, endHour: string) => {
  return `${startHour.replace(":", "h")} à ${endHour.replace(":", "h")}`;
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
          pathname: `/events/${_id}`,
        }}
      >
        <Button iconId="fr-icon-arrow-right-line" iconPosition="right">
          Consulter
        </Button>
      </Link>
    </td>
  </tr>
);
