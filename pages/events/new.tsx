import React, { useMemo } from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/router";

import { EventForm } from "@/components/events/event-form";
import { createEvent, getEvent } from "@/lib/events";
import { EventDTO } from "../../server/lib/events/dto";
import { Event } from "../../server/lib/events/entity";

interface NewEventPageProps {
  duplicatEvent?: Event | null;
}

const NewEventPage = ({ duplicatEvent }: NewEventPageProps) => {
  const router = useRouter();

  const onCreate = async (formData: EventDTO) => {
    try {
      const newEvent = await createEvent(formData);
      toast("Evènement créé", { type: "success" });
      await router.push("/events");
    } catch (error: unknown) {
      console.error(error);
      toast("Erreur lors de la création de l'évènement", { type: "error" });
    }
  };

  return (
    <div className="fr-container">
      <EventForm
        title={<h3>Création d&apos;un nouvel évènement</h3>}
        data={duplicatEvent}
        onSubmit={onCreate}
        submitLabel="Créer l'évènement"
        isCreation
      />
    </div>
  );
};

export async function getServerSideProps({ query }) {
  let duplicatEvent: Event = null;
  if (query.duplicatEvent) {
    duplicatEvent = await getEvent(query.duplicatEvent);
  }

  return {
    props: {
      duplicatEvent,
    },
  };
}

export default NewEventPage;
