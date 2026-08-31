import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";
import { BanSourcesStat } from "@/lib/api-stats";
import { formatDate } from "@/lib/util/date";

ChartJS.register(...registerables);

interface SourcesPublicationBanChartProps {
  sourcesPublicationBan: BanSourcesStat;
}

const SOURCES = [
  { key: "bal", match: ["commune"], label: "BAL", color: "#008300" },
  { key: "cadastre", match: ["cadastre"], label: "Cadastre", color: "#2a78d6" },

  { key: "arcep", match: ["arcep"], label: "ARCEP", color: "#4a3aa7" },
  {
    key: "laposte",
    match: ["laposte", "la-poste", "la poste"],
    label: "La Poste",
    color: "#eb6834",
  },
  { key: "sdis", match: ["sdis"], label: "SDIS", color: "#e34948" },

  {
    key: "ban",
    match: ["ign", "inconnue", "ban"],
    label: "Assemblage",
    color: "#898781",
  },
];

const normalizeSourceKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const SOURCE_BY_KEY = new Map(
  SOURCES.flatMap((source) =>
    source.match.map((alias) => [normalizeSourceKey(alias), source]),
  ),
);

export const SourcesPublicationBanChart = ({
  sourcesPublicationBan,
}: SourcesPublicationBanChartProps) => {
  const data = useMemo(() => {
    const dates = Object.keys(sourcesPublicationBan || {}).sort();

    const seriesByKey = new Map<string, number[]>();
    const otherSeries = dates.map(() => 0);

    dates.forEach((date, index) => {
      Object.entries(sourcesPublicationBan[date]).forEach(([rawKey, count]) => {
        const source = SOURCE_BY_KEY.get(normalizeSourceKey(rawKey));
        if (!source) {
          otherSeries[index] += count;
          return;
        }
        if (!seriesByKey.has(source.key)) {
          seriesByKey.set(
            source.key,
            dates.map(() => 0),
          );
        }
        seriesByKey.get(source.key)[index] += count;
      });
    });

    const datasets = SOURCES.filter((source) =>
      seriesByKey.has(source.key),
    ).map((source) => ({
      label: source.label,
      data: seriesByKey
        .get(source.key)
        .map((value, index) => ({ x: dates[index], y: value })),
      backgroundColor: source.color,
      borderColor: source.color,
      fill: true,
      stack: "sources",
      pointRadius: 0,
      borderWidth: 1,
      tension: 0.3,
    }));

    return { datasets };
  }, [sourcesPublicationBan]);

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
            text: "Évolution de la composition de la Base Adresse Nationale",
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
                ` ${item.dataset.label} : ${item.parsed.y.toLocaleString("fr-FR")}`,
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
              unit: "year",
              displayFormats: { year: "yyyy" },
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              callback: (value) => Number(value).toLocaleString("fr-FR"),
            },
          },
        },
      }}
    />
  );
};
