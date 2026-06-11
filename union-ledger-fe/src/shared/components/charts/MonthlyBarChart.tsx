import { formatCompactKrw } from "@/utils/format";
import * as styles from "./MonthlyBarChart.css";

export interface BarDatum {
  label: string;
  value: number;
}

interface MonthlyBarChartProps {
  data: BarDatum[];
  formatValue?: (value: number) => string;
}

const CHART_WIDTH = 340;
const CHART_HEIGHT = 150;
const PLOT_HEIGHT = 100;
const BASE_Y = 122;

const MonthlyBarChart = ({
  data,
  formatValue = formatCompactKrw,
}: MonthlyBarChartProps) => {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((datum) => datum.value), 1);
  const slot = CHART_WIDTH / data.length;
  const barWidth = Math.min(36, slot * 0.55);
  // 칸이 좁아지면 막대 위 금액 라벨이 겹치므로 생략
  const showValueLabels = data.length <= 8;

  const ariaSummary = data
    .map((datum) => `${datum.label} ${formatValue(datum.value)}`)
    .join(", ");

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      role="img"
      aria-label={`월별 지출 — ${ariaSummary}`}
    >
      <line x1="0" y1={BASE_Y} x2={CHART_WIDTH} y2={BASE_Y} className={styles.axis} />
      {data.map((datum, index) => {
        const height = Math.max(2, (datum.value / max) * PLOT_HEIGHT);
        const x = slot * index + (slot - barWidth) / 2;
        const y = BASE_Y - height;
        const centerX = slot * index + slot / 2;

        return (
          <g key={`${datum.label}-${index}`}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={height}
              rx="3"
              className={styles.bar}
            />
            {showValueLabels && (
              <text
                x={centerX}
                y={y - 5}
                textAnchor="middle"
                className={styles.valueLabel}
              >
                {formatValue(datum.value)}
              </text>
            )}
            <text
              x={centerX}
              y={BASE_Y + 14}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {datum.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default MonthlyBarChart;
