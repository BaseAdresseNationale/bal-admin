import styled from "styled-components";
import { WebinaireStat } from "@/lib/api-stats";
import { DISPLAY_FROM_DATE } from "./charts/webinaires";

const SummaryRow = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 16px 0;
  padding: 24px 40px;
  border-radius: 8px;
  background-color: var(--background-alt-blue-france);
  border: 1px solid var(--border-default-grey);
`;

const Count = styled.p`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-title-blue-france);
`;

const Label = styled.p`
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-default-grey);
`;

interface WebinairesSummaryProps {
  webinaires: WebinaireStat[];
}

const WebinairesSummary = ({ webinaires }: WebinairesSummaryProps) => {
  const list = (webinaires || []).filter(
    (webinaire) => webinaire.date >= DISPLAY_FROM_DATE,
  );

  if (list.length === 0) {
    return null;
  }

  const totalWebinaires = list.length;
  const totalParticipants = list.reduce(
    (sum, webinaire) => sum + webinaire.nbParticipants,
    0,
  );

  return (
    <SummaryRow>
      <Card>
        <Count>{totalWebinaires.toLocaleString("fr-FR")}</Count>
        <Label>webinaires</Label>
      </Card>
      <Card>
        <Count>{totalParticipants.toLocaleString("fr-FR")}</Count>
        <Label>inscrits au total</Label>
      </Card>
    </SummaryRow>
  );
};

export default WebinairesSummary;
