import PropTypes from "prop-types";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useMemo } from "react";

ChartJS.register(...registerables);

// Ordre + couleurs validés (skill dataviz, palette catégorielle, slots 1-3,
// seul triplet passant le gate CVD "all-pairs" requis par un anneau à 3 parts).
export const CATEGORIES = ["departement", "epci", "autre"];

export const CATEGORY_CONFIG = {
  departement: { label: "Département", color: "#2a78d6" },
  epci: { label: "EPCI", color: "#eb6834" },
  autre: { label: "Autre", color: "#1baf7a" },
};

const MIN_LABEL_ARC_WIDTH = 9;

// Choisit un texte clair ou foncé selon la luminance perçue de la couleur de fond,
// pour rester lisible une fois le label posé à l'intérieur de l'arc coloré.
function getContrastTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#0b0b0b" : "#ffffff";
}

// Raccourcit `text` avec une ellipse pour qu'il tienne dans `maxWidth` px avec la police déjà réglée sur ctx.
function truncateToWidth(ctx, text, maxWidth) {
  if (maxWidth <= 0) return "";
  if (ctx.measureText(text).width <= maxWidth) return text;

  const ellipsis = "…";
  let lo = 0;
  let hi = text.length;
  let best = "";
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const candidate = text.slice(0, mid) + ellipsis;
    if (ctx.measureText(candidate).width <= maxWidth) {
      best = candidate;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

const radialPartnerLabelsPlugin = {
  id: "radialPartnerLabels",
  afterDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    const dataset = chart.data.datasets[0];
    if (!dataset?.labels || !meta) return;

    const { ctx } = chart;

    meta.data.forEach((arc, i) => {
      const { x, y, innerRadius, outerRadius, startAngle, endAngle } =
        arc.getProps(
          ["x", "y", "innerRadius", "outerRadius", "startAngle", "endAngle"],
          true,
        );
      const arcWidth = (endAngle - startAngle) * outerRadius;
      if (arcWidth < MIN_LABEL_ARC_WIDTH) return;

      const midAngle = (startAngle + endAngle) / 2;
      const midRadius = (innerRadius + outerRadius) / 2;
      const flip = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(midAngle + (flip ? Math.PI : 0));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "9px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = getContrastTextColor(dataset.backgroundColor[i]);
      // Le texte s'étend radialement (vers le centre / vers le bord) : on le
      // borne à l'épaisseur de l'anneau pour qu'il ne déborde pas sur les
      // arcs voisins, plus fins près du centre.
      const maxWidth = outerRadius - innerRadius - 6;
      const label = truncateToWidth(ctx, dataset.labels[i], maxWidth);
      if (label) {
        ctx.fillText(label, flip ? -midRadius : midRadius, 0);
      }
      ctx.restore();
    });
  },
};

const categoryLabelsPlugin = {
  id: "categoryLabels",
  afterDraw(chart) {
    const meta = chart.getDatasetMeta(1);
    const dataset = chart.data.datasets[1];
    if (!dataset?.labels || !meta) return;

    const { ctx } = chart;

    meta.data.forEach((arc, i) => {
      const { x, y, innerRadius, outerRadius, startAngle, endAngle } =
        arc.getProps(
          ["x", "y", "innerRadius", "outerRadius", "startAngle", "endAngle"],
          true,
        );
      if (dataset.data[i] === 0) return;

      const midAngle = (startAngle + endAngle) / 2;
      const midRadius = (innerRadius + outerRadius) / 2;
      const label = dataset.labels[i];

      // Largeur dispo pour un texte horizontal centré sur ce secteur : la corde
      // du cercle à mi-rayon. Pour les petites catégories (ex. "Autre" à côté
      // de "Département"), on réduit la police plutôt que de laisser chevaucher.
      const chordWidth =
        2 * midRadius * Math.sin((endAngle - startAngle) / 2) - 12;

      const minFontSize = 9;
      let fontSize = 16;
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
      while (fontSize > minFontSize && ctx.measureText(label).width > chordWidth) {
        fontSize -= 1;
        ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
      }
      // Toujours plus large que la corde même à la police minimale : on tronque
      // plutôt que de masquer complètement le nom de la catégorie.
      const finalLabel = truncateToWidth(ctx, label, chordWidth);
      if (!finalLabel) return;

      ctx.save();
      ctx.translate(
        x + midRadius * Math.cos(midAngle),
        y + midRadius * Math.sin(midAngle),
      );
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = getContrastTextColor(dataset.backgroundColor[i]);
      ctx.fillText(finalLabel, 0, 0);
      ctx.restore();
    });
  },
};

export function groupPartenairesByCategory(partenaires) {
  return CATEGORIES.reduce((acc, category) => {
    acc[category] = (partenaires || []).filter((p) => p.type === category);
    return acc;
  }, {});
}

const PartenairesChart = ({ partenaires }) => {
  const data = useMemo(() => {
    const byCategory = groupPartenairesByCategory(partenaires);
    const orderedPartners = CATEGORIES.flatMap((category) => byCategory[category]);

    const partnersDataset = {
      data: orderedPartners.map(() => 1),
      backgroundColor: orderedPartners.map(
        (p) => CATEGORY_CONFIG[p.type]?.color || "#898781",
      ),
      labels: orderedPartners.map((p) => p.name),
      weight: 1.6,
      borderWidth: 1,
      borderColor: "#ffffff",
    };

    const categoriesDataset = {
      data: CATEGORIES.map((category) => byCategory[category].length),
      backgroundColor: CATEGORIES.map((category) => CATEGORY_CONFIG[category].color),
      labels: CATEGORIES.map((category) => CATEGORY_CONFIG[category].label),
      weight: 1,
      borderWidth: 1,
      borderColor: "#ffffff",
    };

    // dataset index 0 = anneau extérieur (chart.js), index 1 = anneau intérieur
    return { datasets: [partnersDataset, categoriesDataset] };
  }, [partenaires]);

  return (
    // position: relative sur le conteneur direct du canvas : sans ça, chart.js
    // ne peut pas mesurer une taille stable dans un parent flex (`.chart-wrapper`)
    // et le doughnut grandit à chaque cycle de resize au lieu de rester borné.
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Chart
        type="doughnut"
        data={data}
        plugins={[radialPartnerLabelsPlugin, categoryLabelsPlugin]}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "10%",
          plugins: {
            title: {
              display: true,
              text: "Répartition des partenaires de la charte",
              font: { size: 18 },
            },
            legend: { display: false },
            tooltip: { enabled: false },
          },
        }}
      />
    </div>
  );
};

PartenairesChart.propTypes = {
  partenaires: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ),
};

export default PartenairesChart;
