import React from "react";
import Link from "next/link";

import { Button } from "@codegouvfr/react-dsfr/Button";

import { EditableList } from "../../components/editable-list";
import { getEvents } from "../../lib/events";
import type { EventType } from "../../types/event";
import { EventItem } from "@/components/events/event-item";

type EventsPageProps = {
  events: EventType[];
};

const EventsPage = ({ events }: EventsPageProps) => (
  <div className="fr-container">
    <EditableList
      headers={["Type", "Nom", "Date", "Horaires"]}
      caption="Liste des évènements"
      data={events}
      filter={{
        placeholder: "Filtrer par nom",
        property: "name",
      }}
      createBtn={
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--right">
          <div className="fr-col-2">
            <Link
              passHref
              href={{
                pathname: "/events/new",
              }}
            >
              <Button iconId="fr-icon-add-line">Créer un évènement</Button>
            </Link>
          </div>
        </div>
      }
      renderItem={EventItem}
    />
  </div>
);

export async function getServerSideProps() {
  const events = await getEvents();

  return {
    props: {
      events,
    },
  };
}

export default EventsPage;
