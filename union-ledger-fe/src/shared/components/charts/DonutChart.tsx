import { vars } from "@/styles/theme.css";
import { formatKrw } from "@/utils/format";
import * as styles from "./DonutChart.css";

export interface DonutDatum {
  label: string;
  value: number;
}

interface DonutChartProps {
  data: DonutDatum[];
  /** 도넛 중앙 강조 텍스트 (예: 총액) */
  centerLabel?: string;
  centerSubLabel?: string;
  formatValue?: (value: number) => string;
}

const PALETTE = [
  vars.color.accent.indigo,
  vars.color.accent.blue,
  vars.color.accent.cyan,
  vars.color.accent.teal,
  vars.color.accent.orange,
  vars.color.accent.pink,
  vars.color.accent.purple,
  vars.color.accent.green,
  vars.color.accent.red,
];

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DonutChart = ({
  data,
  centerLabel,
  centerSubLabel,
  formatValue = formatKrw,
}: DonutChartProps) => {
  const filtered = data.filter((datum) => datum.value > 0);
  const total = filtered.reduce((sum, datum) => sum + datum.value, 0);

  if (total <= 0) return null;

  const fractions = filtered.map((datum) => datum.value / total);
  const segments = filtered.map((datum, index) => {
    const fraction = fractions[index];
    const offset =
      fractions.slice(0, index).reduce((sum, value) => sum + value, 0) *
      CIRCUMFERENCE;

    return {
      ...datum,
      color: PALETTE[index % PALETTE.length],
      fraction,
      dash: fraction * CIRCUMFERENCE,
      offset,
    };
  });

  const ariaSummary = segments
    .map((segment) => `${segment.label} ${Math.round(segment.fraction * 100)}%`)
    .join(", ");

  return (
    <div className={styles.container}>
      <svg
        className={styles.svg}
        viewBox="0 0 120 120"
        role="img"
        aria-label={`항목별 비율 — ${ariaSummary}`}
      >
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="#EEF0F4"
          strokeWidth="15"
        />
        {segments.map((segment) => (
          <circle
            key={segment.label}
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={segment.color}
            strokeWidth="15"
            strokeDasharray={`${segment.dash} ${CIRCUMFERENCE - segment.dash}`}
            strokeDashoffset={-segment.offset}
            transform="rotate(-90 60 60)"
          />
        ))}
        {centerLabel && (
          <text
            x="60"
            y={centerSubLabel ? 60 : 64}
            textAnchor="middle"
            className={styles.centerLabel}
          >
            {centerLabel}
          </text>
        )}
        {centerSubLabel && (
          <text
            x="60"
            y="74"
            textAnchor="middle"
            className={styles.centerSub}
          >
            {centerSubLabel}
          </text>
        )}
      </svg>

      <ul className={styles.legend}>
        {segments.map((segment) => (
          <li key={segment.label} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: segment.color }}
            />
            <span className={styles.legendLabel}>{segment.label}</span>
            <span className={styles.legendValue}>
              {formatValue(segment.value)} ·{" "}
              {Math.round(segment.fraction * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonutChart;
