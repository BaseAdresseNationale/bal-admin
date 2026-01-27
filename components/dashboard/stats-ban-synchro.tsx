import styled from "styled-components";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";

const StyledWrapper = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
  .stat-item {
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
  }
`;

interface StatsBanSynchroProps {
  nbCommunesWithBanErrors: number;
  nbCommunesStillWithBanErrors: string[];
  nbRevisionsWithBanErrors: number;
  nbRevisionsWithWarnings: number;
}

const StatsBanSynchroComponent = ({
  nbCommunesWithBanErrors,
  nbCommunesStillWithBanErrors,
  nbRevisionsWithBanErrors,
  nbRevisionsWithWarnings,
}: StatsBanSynchroProps) => {
  const stats = [
    {
      name: "nbCommunesStillWithBanErrors",
      value: nbCommunesStillWithBanErrors,
      description: "Nombre de BAL toujours en erreur",
    },
    {
      name: "nbCommunesWithBanErrors",
      value: nbCommunesWithBanErrors,
      description: "Nombre de BAL en erreur",
    },
    {
      name: "nbRevisionsWithBanErrors",
      value: nbRevisionsWithBanErrors,
      description: "Nombre de révisions en erreur",
    },
    {
      name: "nbRevisionsWithWarnings",
      value: nbRevisionsWithWarnings,
      description: "Nombre de révisions avec warnings",
    },
  ];

  return (
    <StyledWrapper>
      {stats.map((stat) => (
        <>
          {stat.name === "nbCommunesStillWithBanErrors" ? (
            <Tooltip
              kind="hover"
              title={(stat.value as string[]).join(", ")}
              key={stat.name}
            >
              <div className="stat-item">
                <h3>{(stat.value as string[]).length}</h3>
                <p>{stat.description}</p>
              </div>
            </Tooltip>
          ) : (
            <div className="stat-item" key={stat.name}>
              <h3>{stat.value as number}</h3>
              <p>{stat.description}</p>
            </div>
          )}
        </>
      ))}
    </StyledWrapper>
  );
};

export default StatsBanSynchroComponent;
