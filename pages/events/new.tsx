import React from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/router";

import { EventForm } from "@/components/events/event-form";
import { createEvent } from "@/lib/events";
import { EventType } from "types/event";

const NewEventPage = () => {
  const router = useRouter();

  const onCreate = async (formData: Partial<EventType>) => {
    try {
      const newEvent = await createEvent(formData);
      toast("Evènement créé", { type: "success" });
      await router.push("/events");
    } catch (error: unknown) {
      console.log(error);
      toast("Erreur lors de la création de l'évènement", { type: "error" });
    }
  };

  return (
    <div className="fr-container">
      <EventForm
        title={<h3>Création d&apos;un nouvel évènement</h3>}
        onSubmit={onCreate}
        submitLabel="Créer l'évènement"
        isCreation
      />
    </div>
  );
};

export default NewEventPage;
