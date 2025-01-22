import { Participant } from "server/lib/participant/entity";

interface ParticipantItemProps {
  participant: Participant;
}

const ParticipantItem = ({ participant }: ParticipantItemProps) => (
  <tr>
    <td className="fr-col fr-my-1v">{participant.fullname}</td>
    <td className="fr-col fr-my-1v">{participant.email}</td>
    <td className="fr-col fr-my-1v">{participant.community}</td>
    <td className="fr-col fr-my-1v">{participant.function}</td>
  </tr>
);

export default ParticipantItem;
