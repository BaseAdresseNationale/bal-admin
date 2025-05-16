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
  telephones: string[];
  signalementCount: {
    pending: number;
    processed: number;
    ignored: number;
    expired: number;
  };
  isCommuneSignalementDisabled: boolean;
  codeCommune: string;
}

export function CommuneInfosHeader({
  emails,
  telephones,
  signalementCount,
  isCommuneSignalementDisabled,
  codeCommune,
}: CommuneInfosHeaderProps) {
  return (
    <StyledWrapper>
      <div>
        <h5>Contact mairie</h5>
        <div>
          <b>Email(s) : </b>
          {emails.join(", ")}
        </div>
        <div>
          <b>Numéro(s) de téléphone : </b>
          {telephones.join(", ")}
        </div>
      </div>
      <SignalementTable
        signalementCount={signalementCount}
        isCommuneSignalementDisabled={isCommuneSignalementDisabled}
        codeCommune={codeCommune}
      />
    </StyledWrapper>
  );
}
