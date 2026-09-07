import styled from "styled-components";
import SourcesPublicationBanChart from "./charts/sources-publication-ban";
import FirstPublicationsMonthsChart from "./charts/first-publications-months";
import { useDashboardData } from "@/hooks/dashboard-data";
import Loader from "../loader";

const BalLabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > .chart-wrapper {
    margin: 10px 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 500px;
  }
`;
const BalLabCharts = () => {
  const { dashboardData, isLoading } = useDashboardData();

  return (
    <Loader isLoading={isLoading}>
      <BalLabContainer>
        <div className="chart-wrapper">
          <FirstPublicationsMonthsChart
            firstPublicationsMonths={dashboardData.firstsPublications}
          />
        </div>
        <br />
        <div className="chart-wrapper">
          <SourcesPublicationBanChart
            sourcesPublicationBan={dashboardData.sourcesPublicationBan}
          />
        </div>
      </BalLabContainer>
    </Loader>
  );
};

export default BalLabCharts;
