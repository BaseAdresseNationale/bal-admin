import PropTypes from "prop-types";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";
import { formatDate } from "@/lib/util/date";

ChartJS.register(...registerables);

// Valeurs de EventTypeEnum (server/lib/events/entity.ts) et mêmes couleurs que
// le badge d'event (components/events/event-item.tsx). Recopiées en dur ici
// pour éviter d'importer l'entité TypeORM (et tout typeorm/) dans le bundle client.
const TYPE_CONFIG = [
  { key: "formation", label: "formation", color: "rgb(15, 111, 0)" },
  {
    key: "formation-lvl2",
    label: "formation-lvl2",
    color: "rgb(3, 189, 91)",
  },
  {
    key: "formation spéciale",
    label: "formation spéciale",
    color: "rgb(255, 115, 44)",
  },
  { key: "partenaire", label: "partenaire", color: "rgb(0, 83, 179)" },
];

const TYPE_LABELS = TYPE_CONFIG.map(({ label }) => label);

export const DISPLAY_FROM_DATE = "2022-01-01";

const MIN_RADIUS = 3;
const MAX_RADIUS = 16;
const RADIUS_SCALE = 1;

const bubbleRadius = (nbParticipants) =>
  Math.min(
    MAX_RADIUS,
    MIN_RADIUS + Math.sqrt(Math.max(0, nbParticipants)) * RADIUS_SCALE,
  );

const withAlpha = (rgbColor, alpha) =>
  rgbColor.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);

const WebinairesChart = ({ webinaires }) => {
  const data = useMemo(() => {
    const list = (webinaires || []).filter(
      (webinaire) => webinaire.date >= DISPLAY_FROM_DATE,
    );

    const datasets = TYPE_CONFIG.map(({ key, label, color }) => ({
      label,
      data: list
        .filter((webinaire) => webinaire.type === key)
        .map((webinaire) => ({
          x: webinaire.date,
          y: label,
          r: bubbleRadius(webinaire.nbParticipants),
          nbParticipants: webinaire.nbParticipants,
        })),
      backgroundColor: withAlpha(color, 0.6),
      borderColor: color,
      borderWidth: 1,
    }));

    return { datasets };
  }, [webinaires]);

  return (
    <Chart
      type="bubble"
      data={data}
      options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Visualisation des webinaires et du nombre de participants",
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
              title: (items) => formatDate(items[0].parsed.x, "PPP"),
              label: (item) =>
                ` ${item.dataset.label} — ${item.raw.nbParticipants} participant(s)`,
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
          y: {
            type: "category",
            labels: TYPE_LABELS,
            offset: true,
          },
        },
      }}
    />
  );
};

WebinairesChart.propTypes = {
  webinaires: PropTypes.array,
};

export default WebinairesChart;
