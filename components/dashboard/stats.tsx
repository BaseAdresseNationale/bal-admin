import { useEffect, useState } from "react";
import styled from "styled-components";
import { getStats } from "@/lib/stats";
import { Stats } from "types/stats.type";
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

const StatsComponent = () => {
  const [stats, setStats] = useState<Array<Stats<number | string[]>>>([]);

  useEffect(() => {
    async function fetchStats() {
      const data = await getStats();
      setStats(data);
    }
    fetchStats();
  }, []);

  const getStatDexription = (name: string) => {
    switch (name) {
      case "nbCommunesWithBanErrors":
        return "Nombre de BAL en erreur";
      case "nbCommunesStillWithBanErrors":
        return "Nombre de BAL toujours en erreur";
      case "nbRevisionsWithBanErrors":
        return "Nombre de révisions en erreur";
      case "nbRevisionsWithWarnings":
        return "Nombre de révisions avec warnings";
    }
  };

  return (
    <StyledWrapper>
      {stats.map((stat) => (
        <>
          {stat.name == "nbCommunesStillWithBanErrors" ? (
            <Tooltip kind="hover" title={(stat.value as string[]).join(", ")}>
              <div className="stat-item" key={stat.id}>
                <h3>{(stat.value as string[]).length}</h3>
                <p>{getStatDexription(stat.name)}</p>
              </div>
            </Tooltip>
          ) : (
            <div className="stat-item" key={stat.id}>
              <h3>{stat.value}</h3>
              <p>{getStatDexription(stat.name)}</p>
            </div>
          )}
        </>
      ))}
    </StyledWrapper>
  );
};

export default StatsComponent;
