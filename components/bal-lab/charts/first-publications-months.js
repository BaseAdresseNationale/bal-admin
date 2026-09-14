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

// Compare deux clés au format `MM-yyyy` par ordre chronologique
const compareMonthLabels = (a, b) => {
  const [monthA, yearA] = a.split("-");
  const [monthB, yearB] = b.split("-");
  return yearA === yearB ? monthA - monthB : yearA - yearB;
};

// Trie les clés au format `MM-yyyy` par ordre chronologique
const sortMonthLabels = (labels) => [...labels].sort(compareMonthLabels);

// Génère toutes les clés `MM-yyyy` entre deux bornes (incluses)
const buildMonthRange = (fromLabel, toLabel) => {
  const [fromMonth, fromYear] = fromLabel.split("-").map(Number);
  const [toMonth, toYear] = toLabel.split("-").map(Number);

  const labels = [];
  let month = fromMonth;
  let year = fromYear;
  while (year < toYear || (year === toYear && month <= toMonth)) {
    labels.push(`${String(month).padStart(2, "0")}-${year}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return labels;
};

// Clé au format `MM-yyyy` (mois indexé à partir de 1, sur 2 chiffres)
const OBJECTIVES = {
  "01-2022": 5000,
  "01-2023": 10000,
  "01-2024": 15000,
  "01-2025": 20000,
  "01-2026": 25000,
  "01-2027": 30000,
  "01-2028": 35000,
};

const DISPLAY_FROM_YEAR = 2020;

const FirstPublicationsMonthsChart = ({ firstPublicationsMonths }) => {
  const data = useMemo(() => {
    const sortedLabels = sortMonthLabels(Object.keys(firstPublicationsMonths));
    const lastObjectiveLabel = sortMonthLabels(Object.keys(OBJECTIVES)).at(-1);

    const cumulByLabel = {};
    let cumul = 0;
    for (const label of sortedLabels) {
      cumul += firstPublicationsMonths[label];
      cumulByLabel[label] = cumul;
    }

    const firstLabel =
      sortedLabels.find(
        (label) => Number(label.split("-")[1]) >= DISPLAY_FROM_YEAR,
      ) ?? `01-${DISPLAY_FROM_YEAR}`;
    const lastDataLabel = sortedLabels.at(-1);
    const lastLabel = [lastDataLabel, lastObjectiveLabel]
      .filter(Boolean)
      .sort(compareMonthLabels)
      .at(-1);

    const labels = buildMonthRange(firstLabel, lastLabel);

    let lastKnownCumul = null;
    const cumulatedFirstPublications = labels.map((label) => {
      if (cumulByLabel[label] !== undefined) {
        lastKnownCumul = cumulByLabel[label];
      } else if (
        lastDataLabel &&
        compareMonthLabels(label, lastDataLabel) > 0
      ) {
        return null;
      }
      return lastKnownCumul;
    });

    return {
      labels,
      datasets: [
        {
          label: "Cumul BAL publiées",
          data: cumulatedFirstPublications,
          color: "#36A2EB",
          pointRadius: 0,
          tension: 0.4,
        },
        {
          label: "Objectif",
          data: labels.map((label) => OBJECTIVES[label] ?? null),
          showLine: false,
          pointRadius: 6,
          color: "#FF6384",
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
          y: {
            min: 0,
            max: 36000,
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
