import { SignalementTable } from "./signalement-table";
import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 1.5rem;
  gap: 1rem;

  > div {
    flex: 1 1 300px;
  }

  .fr-table {
    margin-top: 0;
  }
`;

interface CommuneInfosHeaderProps {
  emails: string[];
  signalementCount: {
    pending: number;
    processed: number;
    ignored: number;
    expired: number;
  };
}

export function CommuneInfosHeader({
  emails,
  signalementCount,
}: CommuneInfosHeaderProps) {
  return (
    <StyledWrapper>
      <div>
        <h5>Emails de la commune</h5>
        {emails.map((email) => (
          <p key={email}>{email}</p>
        ))}
      </div>
      <SignalementTable signalementCount={signalementCount} />
    </StyledWrapper>
  );
}
