import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

import { EventForm } from "@/components/events/event-form";
import {
  deleteEvent,
  getEvent,
  getEventParticipants,
  updateEvent,
} from "@/lib/events";
import { Event } from "../../server/lib/events/entity";
import { EventDTO } from "server/lib/events/dto";
import { Participant } from "server/lib/participant/entity";
import EventParticipantTable from "@/components/events/event-participants-table";

type EventPageProps = {
  event: Event;
};

const deleteEventModale = createModal({
  id: "delete-event-modale",
  isOpenedByDefault: false,
});

const EventPage = ({ event }: EventPageProps) => {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const loadParticpants = async () => {
      const res = await getEventParticipants(event.id);
      setParticipants(res);
    };

    loadParticpants();
  }, [event.id]);

  const onUpdate = async (formData: EventDTO) => {
    try {
      await updateEvent(event.id, formData);
      toast("Modifications enregistrées", { type: "success" });
    } catch (error: unknown) {
      console.error(error);
      toast("Erreur lors de l’enregistrement des modifications", {
        type: "error",
      });
    }
  };

  const onDelete = async () => {
    try {
      await deleteEvent(event.id);
      toast("Evènement supprimé", { type: "success" });
      await router.push("/events");
    } catch (error: unknown) {
      console.error(error);
      toast("Erreur lors de la suppression de l'évènement", { type: "error" });
    }
  };

  return (
    <div className="fr-container">
      <EventForm
        title={<h3>{event.title}</h3>}
        data={event}
        onSubmit={onUpdate}
        submitLabel={"Enregistrer les modifications"}
        controls={
          <Button
            type="button"
            priority="tertiary"
            onClick={() => {
              deleteEventModale.open();
            }}
          >
            Supprimer
          </Button>
        }
      />
      <deleteEventModale.Component title="Suppression">
        <p>Êtes-vous sûr de vouloir supprimer cet évènement?</p>
        <div>
          <Button onClick={onDelete}>Supprimer</Button>
          <Button
            style={{ marginLeft: "1rem" }}
            priority="tertiary"
            onClick={() => {
              deleteEventModale.close();
            }}
          >
            Annuler
          </Button>
        </div>
      </deleteEventModale.Component>
      <EventParticipantTable eventId={event.id} participants={participants} />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { id } = params;
  const event = await getEvent(id);

  return {
    props: { event },
  };
}

export default EventPage;
