import PropTypes from "prop-types";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";
import { formatDate } from "@/lib/util/date";

ChartJS.register(...registerables);

const ZammadTicketsChart = ({ zammad }) => {
  const data = useMemo(() => {
    const months = zammad?.months || [];

    return {
      datasets: [
        {
          type: "bar",
          label: "Tickets ouverts",
          data: months.map(({ month, opened }) => ({ x: month, y: opened })),
          backgroundColor: "#20B254",
          borderColor: "#20B254",
          stack: "flux",
          yAxisID: "yFlux",
        },
        {
          type: "bar",
          label: "Tickets fermés",
          data: months.map(({ month, closed }) => ({ x: month, y: -closed })),
          backgroundColor: "#4998D3",
          borderColor: "#4998D3",
          stack: "flux",
          yAxisID: "yFlux",
        },
        {
          type: "line",
          label: "Tickets en attente",
          data: months.map(({ month, pending }) => ({ x: month, y: pending })),
          borderColor: "#F05223",
          backgroundColor: "#F05223",
          yAxisID: "yPending",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2,
        },
      ],
    };
  }, [zammad]);

  return (
    <Chart
      type="bar"
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
            text: "Tickets du support Zammad",
            font: {
              size: 18,
            },
          },
          legend: {
            display: true,
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              title: (items) => formatDate(items[0].parsed.x, "MMMM yyyy"),
              label: (item) => {
                const value =
                  item.dataset.label === "Tickets fermés"
                    ? Math.abs(item.parsed.y)
                    : item.parsed.y;
                return ` ${item.dataset.label} : ${value.toLocaleString("fr-FR")}`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "time",
            adapters: {
              date: { locale: fr },
            },
            time: {
              unit: "month",
              displayFormats: { month: "MMM yyyy" },
            },
          },
          yFlux: {
            position: "left",
            title: {
              display: true,
              text: "Tickets ouverts/fermés",
            },
          },
          yPending: {
            position: "right",
            beginAtZero: true,
            title: {
              display: true,
              text: "Tickets en attente",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      }}
    />
  );
};

ZammadTicketsChart.propTypes = {
  zammad: PropTypes.object,
};

export default ZammadTicketsChart;
