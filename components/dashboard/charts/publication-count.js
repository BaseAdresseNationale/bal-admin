import { Chart } from "react-chartjs-2";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Chart as ChartJS, registerables } from "chart.js";
import { useMemo } from "react";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";

ChartJS.register(...registerables);

const ChartContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 500px;
`;

const StyledTabs = styled(Tabs)`
  .fr-tabs__list {
    justify-content: center;
  }
`;

const SOURCES = [
  {
    key: "mesAdresses",
    label: "Mes Adresses",
    newField: "newBALViaMesAdresses",
    allField: "allBALViaMesAdresses",
    newColor: "#EF9BA8",
    repColor: "#4D9BD3",
  },
  {
    key: "moissonneur",
    label: "Moissonneur",
    newField: "newBALViaMoissonneur",
    allField: "allBALViaMoissonneur",
    newColor: "#EF9BA8",
    repColor: "#4D9BD3",
  },
  {
    key: "other",
    label: "Autre source",
    newField: "newBALViaOther",
    allField: "allBALViaOther",
    newColor: "#EF9BA8",
    repColor: "#4D9BD3",
  },
];

function buildSourceDatasets(bucketData, source) {
  const { newField, allField, newColor, repColor, label } = source;
  return [
    {
      label: `Nouvelles BAL publiées via ${label}`,
      data: bucketData.map((d) => d[newField]),
      backgroundColor: newColor,
    },
    {
      label: `BAL re-publiées via ${label}`,
      data: bucketData.map((d) => d[allField] - d[newField]),
      backgroundColor: repColor,
    },
  ];
}

const PublicationCountChart = ({
  publicationsResponse,
  firstPublicationEvolutionResponse,
  interval,
}) => {
  const { labels, bucketData } = useMemo(() => {
    let labels = publicationsResponse.map(({ date }) => {
      const [year, month, day] = date.split("-");
      return interval && interval > 20
        ? `${month}/${year}`
        : `${day}/${month}/${year}`;
    });

    if (interval) {
      labels = labels.filter((_data, index) => index % interval === 0);
    }

    const newBALPublication = firstPublicationEvolutionResponse.map(
      ({ date, totalCreations, viaMesAdresses, viaMoissonneur }, index) => {
        const [year, month, day] = date.split("-");
        if (index === 0) {
          return { date: `${day}/${month}/${year}`, value: 0 };
        }

        return {
          date: `${day}/${month}/${year}`,
          value: {
            total:
              totalCreations -
              firstPublicationEvolutionResponse[index - 1].totalCreations,
            viaMesAdresses:
              viaMesAdresses -
              firstPublicationEvolutionResponse[index - 1].viaMesAdresses,
            viaMoissonneur:
              viaMoissonneur -
              firstPublicationEvolutionResponse[index - 1].viaMoissonneur,
          },
        };
      },
    );

    const allBALPublication = publicationsResponse.map(
      ({ date, publishedBAL }) => {
        const [year, month, day] = date.split("-");

        return {
          date: `${day}/${month}/${year}`,
          value: Object.values(publishedBAL).reduce(
            (acc, publications) => {
              const { total, viaMesAdresses, viaMoissonneur } = publications;

              return {
                total: acc.total + total,
                viaMesAdresses: acc.viaMesAdresses + viaMesAdresses,
                viaMoissonneur: acc.viaMoissonneur + viaMoissonneur,
              };
            },
            { total: 0, viaMesAdresses: 0, viaMoissonneur: 0 },
          ),
        };
      },
    );

    const data = labels.reduce((acc, cur) => {
      acc.push({
        allBALViaMesAdresses: allBALPublication
          .filter(({ date }) => date.includes(cur))
          .reduce((a, { value }) => a + value.viaMesAdresses, 0),
        allBALViaMoissonneur: allBALPublication
          .filter(({ date }) => date.includes(cur))
          .reduce((a, { value }) => a + value.viaMoissonneur, 0),
        allBALViaOther: allBALPublication
          .filter(({ date }) => date.includes(cur))
          .reduce(
            (a, { value }) =>
              a + (value.total - (value.viaMesAdresses + value.viaMoissonneur)),
            0,
          ),
        newBALViaMesAdresses: newBALPublication
          .filter(({ date }) => date.includes(cur))
          .reduce((a, { value }) => a + value.viaMesAdresses, 0),
        newBALViaMoissonneur: newBALPublication
          .filter(({ date }) => date.includes(cur))
          .reduce((a, { value }) => a + value.viaMoissonneur, 0),
        newBALViaOther: newBALPublication
          .filter(({ date }) => date.includes(cur))
          .reduce(
            (a, { value }) =>
              a + (value.total - (value.viaMesAdresses + value.viaMoissonneur)),
            0,
          ),
      });

      return acc;
    }, []);

    return { labels, bucketData: data };
  }, [publicationsResponse, firstPublicationEvolutionResponse, interval]);

  const chartDataBySource = useMemo(
    () =>
      SOURCES.map((source) => ({
        ...source,
        chartData: {
          labels,
          datasets: buildSourceDatasets(bucketData, source),
        },
      })),
    [labels, bucketData],
  );

  return (
    <StyledTabs
      tabs={chartDataBySource.map(({ key, label, chartData }) => ({
        label,
        content: (
          <ChartContainer>
            <Chart
              key={key}
              type="bar"
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: `Nombre de publications — ${label}`,
                    font: {
                      size: 18,
                    },
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
              }}
            />
          </ChartContainer>
        ),
      }))}
    />
  );
};

PublicationCountChart.propTypes = {
  publicationsResponse: PropTypes.array.isRequired,
  firstPublicationEvolutionResponse: PropTypes.array.isRequired,
  interval: PropTypes.number,
};

export default PublicationCountChart;
