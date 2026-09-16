import styled from "styled-components";
import { differenceInCalendarDays } from "date-fns";
import { NbNewAdressesStat } from "@/lib/api-stats";
import { formatDate } from "@/lib/util/date";

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

const Period = styled.p`
  margin: 8px 0 0;
  font-size: 0.875rem;
  color: var(--text-mention-grey);
`;

interface NbNewAdressesProps {
  nbNewAdresses: NbNewAdressesStat;
}

const NbNewAdresses = ({ nbNewAdresses }: NbNewAdressesProps) => {
  if (!nbNewAdresses) {
    return null;
  }

  const { firstDate, lastDate, count } = nbNewAdresses;
  const nbDays = differenceInCalendarDays(
    new Date(lastDate),
    new Date(firstDate),
  );
  const perDay = nbDays > 0 ? count / nbDays : null;

  return (
    <SummaryRow>
      <Card>
        <Count>{count.toLocaleString("fr-FR")}</Count>
        <Label>nouvelles adresses dans la BAN</Label>
        <Period>
          entre le {formatDate(firstDate, "PPP")} et le{" "}
          {formatDate(lastDate, "PPP")}
        </Period>
      </Card>
      {perDay !== null && (
        <Card>
          <Count>
            {perDay.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
          </Count>
          <Label>nouvelles adresses par jour en moyenne</Label>
          <Period>depuis le {formatDate(firstDate, "PPP")}</Period>
        </Card>
      )}
    </SummaryRow>
  );
};

export default NbNewAdresses;
