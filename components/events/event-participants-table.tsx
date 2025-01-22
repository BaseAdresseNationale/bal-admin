import { useCallback, useState } from "react";

import Pagination from "react-js-pagination";

import { Participant } from "server/lib/participant/entity";
import ParticipantItem from "./participant-item";

interface EventParticipantTableProps {
  participants: Participant[];
}

const EventParticipantTable = ({
  participants,
}: EventParticipantTableProps) => (
  <div className="fr-table">
    <table>
      <caption>Liste des participants</caption>
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

export default EventParticipantTable;
