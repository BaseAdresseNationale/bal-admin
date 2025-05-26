import { useCallback, useState } from "react";

import Pagination from "react-js-pagination";

import { Participant } from "server/lib/participant/entity";
import ParticipantItem from "./participant-item";
import Button from "@codegouvfr/react-dsfr/Button";
import { getEventParticipantsCSV } from "@/lib/events";

interface EventParticipantTableProps {
  eventId: string;
  participants: Participant[];
}

const EventParticipantTable = ({
  eventId,
  participants,
}: EventParticipantTableProps) => {
  const downloadFile = (file: string, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const downloadParticipantCsv = async () => {
    const file = await getEventParticipantsCSV(eventId);
    downloadFile(file, "participant.csv");
  };

  return (
    <div className="fr-table">
      <table>
        <caption>Liste des {participants.length} participant(s)</caption>
        <Button
          priority="primary"
          onClick={downloadParticipantCsv}
          style={{ marginBottom: "12px" }}
        >
          Liste participants CSV
        </Button>
        <thead>
          <tr>
            <th scope="col">Nom/Prénom</th>
            <th scope="col">Email</th>
            <th scope="col">Commune/Collectivité</th>
            <th scope="col">Poste/Fonction</th>
          </tr>
        </thead>

        <tbody>
          {participants.map((participant) => (
            <ParticipantItem key={participant.id} participant={participant} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventParticipantTable;
