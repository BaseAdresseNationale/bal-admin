import PropTypes from "prop-types";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useMemo } from "react";

ChartJS.register(...registerables);

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// Transforme une clé au format `MM-yyyy` (mois indexé à partir de 1, sur 2 chiffres)
// en libellé lisible, ex: "01-2026" -> "Janvier 2026"
const formatMonthLabel = (label) => {
  const [month, year] = label.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
};

// Trie les clés au format `MM-yyyy` par ordre chronologique
const sortMonthLabels = (labels) =>
  [...labels].sort((a, b) => {
    const [monthA, yearA] = a.split("-");
    const [monthB, yearB] = b.split("-");
    return yearA === yearB ? monthA - monthB : yearA - yearB;
  });

// Clé au format `MM-yyyy` (mois indexé à partir de 1, sur 2 chiffres)
const OBJECTIVES = {
  "01-2022": 5000,
  "01-2023": 10000,
  "01-2024": 15000,
  "01-2025": 20000,
  "01-2026": 25000,
};

const DISPLAY_FROM_YEAR = 2020;

const FirstPublicationsMonthsChart = ({ firstPublicationsMonths }) => {
  const data = useMemo(() => {
    const sortedLabels = sortMonthLabels(Object.keys(firstPublicationsMonths));

    let cumul = 0;
    const labels = [];
    const cumulatedFirstPublications = [];
    for (const label of sortedLabels) {
      cumul += firstPublicationsMonths[label];
      const [, year] = label.split("-");
      if (Number(year) >= DISPLAY_FROM_YEAR) {
        labels.push(label);
        cumulatedFirstPublications.push(cumul);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "Cumul BAL publiées",
          data: cumulatedFirstPublications,
          borderColor: "#36A2EB",
          backgroundColor: "#9BD0F5",
          pointRadius: 0,
          tension: 0.4,
        },
        {
          label: "Objectif",
          data: labels.map((label) => OBJECTIVES[label] ?? null),
          showLine: false,
          pointRadius: 6,
          pointBackgroundColor: "#FF6384",
          borderColor: "#FF6384",
        },
      ],
    };
  }, [firstPublicationsMonths]);

  return (
    <Chart
      type="line"
      data={data}
      options={{
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: "Évolution du nombre de BAL publiées",
            font: {
              size: 18,
            },
          },
          tooltip: {
            callbacks: {
              title: (items) => formatMonthLabel(items[0].label),
            },
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              callback: (_value, index) => {
                const label = data.labels[index];
                const [month, year] = label.split("-");
                return month === "01" ? year : "";
              },
            },
          },
        },
      }}
    />
  );
};

FirstPublicationsMonthsChart.propTypes = {
  firstPublicationsMonths: PropTypes.object,
};

export default FirstPublicationsMonthsChart;
