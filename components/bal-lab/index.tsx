import styled from "styled-components";
import SourcesPublicationBanChart from "./charts/sources-publication-ban";
import FirstPublicationsMonthsChart from "./charts/first-publications-months";
import WebinairesChart from "./charts/webinaires";
import ZammadTicketsChart from "./charts/zammad-tickets";
import PartenairesChart from "./charts/partenaires";
import WebinairesSummary from "./webinaires-summary";
import ZammadSummary from "./zammad-summary";
import PartenairesSummary from "./partenaires-summary";
import NbNewAdresses from "./nb-new-adresses";
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
        <NbNewAdresses nbNewAdresses={dashboardData.nbNewAdresses} />
        <br />
        <div className="chart-wrapper">
          <WebinairesChart webinaires={dashboardData.webinaires} />
        </div>
        <WebinairesSummary webinaires={dashboardData.webinaires} />
        <br />
        <div className="chart-wrapper">
          <ZammadTicketsChart zammad={dashboardData.zammad} />
        </div>
        <ZammadSummary zammad={dashboardData.zammad} />
        <br />
        <div className="chart-wrapper" style={{ height: "900px" }}>
          <PartenairesChart partenaires={dashboardData.partenaires} />
        </div>
        <PartenairesSummary partenaires={dashboardData.partenaires} />
      </BalLabContainer>
    </Loader>
  );
};

export default BalLabCharts;
