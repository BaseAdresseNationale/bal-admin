import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useMemo } from "react";

ChartJS.register(...registerables);

interface FirstPublicationsMonthsChart {
  firstPublicationsMonths: Record<string, number>;
}

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

// Transforme une clé au format `${getMonth(date)}-${getYear(date)}` (mois indexé à partir de 0)
// en libellé lisible, ex: "0-2026" -> "Janvier 2026"
const formatMonthLabel = (label: string) => {
  const [month, year] = label.split("-");
  return `${MONTHS[Number(month)]} ${year}`;
};

// Clé au format `${getMonth(date)}-${getYear(date)}` (mois indexé à partir de 0)
const OBJECTIVES: Record<string, number> = {
  "0-2022": 5000,
  "0-2023": 10000,
  "0-2024": 15000,
  "0-2025": 20000,
  "0-2026": 25000,
};

export const FirstPublicationsMonthsChart = ({
  firstPublicationsMonths,
}: FirstPublicationsMonthsChart) => {
  const data = useMemo(() => {
    const labels = Object.keys(firstPublicationsMonths);

    return {
      labels,
      datasets: [
        {
          label: "Cumul BAL publiées",
          data: Object.values(firstPublicationsMonths),
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
                return month === "0" ? year : "";
              },
            },
          },
        },
      }}
    />
  );
};
