import styled from "styled-components";
import { ZammadStat } from "@/lib/api-stats";

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

interface ZammadSummaryProps {
  zammad: ZammadStat;
}

const ZammadSummary = ({ zammad }: ZammadSummaryProps) => {
  if (!zammad || zammad.totalTickets === 0) {
    return null;
  }

  return (
    <SummaryRow>
      <Card>
        <Count>{zammad.totalTickets.toLocaleString("fr-FR")}</Count>
        <Label>tickets au total</Label>
      </Card>
      <Card>
        <Count>{zammad.totalMessages.toLocaleString("fr-FR")}</Count>
        <Label>messages échangés</Label>
      </Card>
    </SummaryRow>
  );
};

export default ZammadSummary;
