import styled from "styled-components";
import Button from "@codegouvfr/react-dsfr/Button";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import PublicationPerDepartmentChart from "./charts/publications-per-department";
import FirstPublicationEvolutionChart from "./charts/first-publication-evolution";
import PublicationCountChart from "./charts/publication-count";
import CreationCountChart from "./charts/creation-count";
import { useDashboardData } from "@/hooks/dashboard-data";
import StatsBanSynchroComponent from "./stats-ban-synchro";
import Loader from "../loader";

export const defaultChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      font: {
        size: 18,
      },
    },
  },
  scales: {
    yAxes: [
      {
        display: true,
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > .dashboard-header {
    margin-top: 15px;
    button {
      margin: 0 5px;
    }
    button.active {
      background-color: var(--active);
    }
  }

  > .chart-wrapper {
    margin: 10px 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 500px;
  }
`;
const timeLapses = [
  {
    label: "Année",
    value: 365,
    interval: 30,
  },
  {
    label: "Mois",
    value: 30,
  },
  {
    label: "Semaine",
    value: 7,
  },
];

interface ResponseItem {
  date: string;
  [key: string]: any;
}

const dayToMs = 1000 * 60 * 60 * 24;
const getISODate = (date: Date): string => format(date, "yyyy-MM-dd");

const Dashboard = () => {
  const [timeLapseIndex, setTimeLapseIndex] = useState(1);
  const { dashboardData, isLoading } = useDashboardData();

  const addEmptyDatesToResponse = (
    response: ResponseItem[],
    timeLapse: number,
    initValue: Record<string, any>,
  ): ResponseItem[] => {
    // Create a Map for O(1) lookups instead of O(n) with find()
    const responseMap = new Map(response.map((item) => [item.date, item]));

    const dates: ResponseItem[] = [];
    for (let i = 0; i <= timeLapse; i++) {
      const curDate = getISODate(
        new Date(Date.now() + (i - timeLapse) * dayToMs),
      );
      const current = responseMap.get(curDate) || {
        date: curDate,
        ...initValue,
      };
      dates.push(current);
    }

    return dates;
  };

  const chartsData = useMemo(() => {
    return {
      firstPublicationEvolutionResponse: addEmptyDatesToResponse(
        dashboardData.firstPublicationEvolutionResponse,
        timeLapses[timeLapseIndex].value,
        { publishedBAL: {} },
      ),
      publicationsResponse: addEmptyDatesToResponse(
        dashboardData.publicationsResponse,
        timeLapses[timeLapseIndex].value,
        { publishedBAL: {} },
      ),
      creationsResponse: addEmptyDatesToResponse(
        dashboardData.creationsResponse,
        timeLapses[timeLapseIndex].value,
        { createdBAL: {} },
      ),
    };
  }, [
    dashboardData.creationsResponse,
    dashboardData.firstPublicationEvolutionResponse,
    dashboardData.publicationsResponse,
    timeLapseIndex,
  ]);

  return (
    <Loader isLoading={isLoading}>
      <DashboardContainer>
        <h3 style={{ paddingTop: "16px" }}>Stats de synchro avec la BAN</h3>
        <StatsBanSynchroComponent
          nbCommunesWithBanErrors={dashboardData.nbCommunesWithBanErrors}
          nbCommunesStillWithBanErrors={
            dashboardData.nbCommunesStillWithBanErrors
          }
          nbRevisionsWithBanErrors={dashboardData.nbRevisionsWithBanErrors}
          nbRevisionsWithWarnings={dashboardData.nbRevisionsWithWarnings}
        />
        <h3 style={{ paddingTop: "16px" }}>Stats de déployement BAL</h3>
        <div className="dashboard-header">
          {timeLapses.map(({ label }, index) => (
            <Button
              key={label}
              type="button"
              className={index === timeLapseIndex ? "active" : ""}
              onClick={() => setTimeLapseIndex(index)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="chart-wrapper">
          <FirstPublicationEvolutionChart
            firstPublicationEvolutionResponse={
              chartsData.firstPublicationEvolutionResponse
            }
            interval={timeLapses[timeLapseIndex].interval}
          />
        </div>
        <div className="chart-wrapper">
          <FirstPublicationEvolutionChart
            firstPublicationEvolutionResponse={
              chartsData.firstPublicationEvolutionResponse
            }
            interval={timeLapses[timeLapseIndex].interval}
          />
        </div>
        <div className="chart-wrapper">
          <PublicationPerDepartmentChart
            publicationsResponse={chartsData.publicationsResponse}
          />
        </div>
        <div className="chart-wrapper">
          <PublicationCountChart
            publicationsResponse={chartsData.publicationsResponse}
            firstPublicationEvolutionResponse={
              chartsData.firstPublicationEvolutionResponse
            }
            interval={timeLapses[timeLapseIndex].interval}
          />
        </div>
        <div className="chart-wrapper">
          <CreationCountChart
            creationsResponse={chartsData.creationsResponse}
            interval={timeLapses[timeLapseIndex].interval}
          />
        </div>
      </DashboardContainer>
    </Loader>
  );
};

export default Dashboard;
