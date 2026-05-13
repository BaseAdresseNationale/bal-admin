import {
  SignalementCommuneSettings,
  SignalementSource,
} from "types/signalement.types";
import { SignalementTable } from "./signalement-table";
import styled from "styled-components";
import { LookupResponse, TypeCompositionEnum } from "@/lib/api-ban";
import Badge from "@codegouvfr/react-dsfr/Badge";

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
  signalementCommuneSettings?: SignalementCommuneSettings;
  codeCommune: string;
  signalementSources: SignalementSource[];
  lookup: LookupResponse;
}

export function CommuneInfosHeader({
  emails,
  telephones,
  signalementCount,
  signalementCommuneSettings,
  codeCommune,
  signalementSources,
  lookup,
}: CommuneInfosHeaderProps) {
  return (
    <StyledWrapper>
      <div>
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
        <div style={{ paddingTop: "32px" }}>
          <h5>Synchronisation avec la BAN</h5>
          <div>
            <b>Type de composition : </b>
            <Badge
              severity={
                lookup.typeComposition === TypeCompositionEnum.BAL
                  ? "success"
                  : null
              }
            >
              {lookup.typeComposition}
            </Badge>
          </div>
          <b>
            {lookup.withBanId
              ? "Sur le Nouveau Socle"
              : "Sur l'ancien ban-plateforme (sans ids stablent)"}
          </b>
        </div>
      </div>
      <SignalementTable
        signalementCount={signalementCount}
        signalementCommuneSettings={signalementCommuneSettings}
        codeCommune={codeCommune}
        signalementSources={signalementSources}
      />
    </StyledWrapper>
  );
}
