export const formatKrw = (amount: number) =>
  `₩${amount.toLocaleString("ko-KR")}`;

// ISO 날짜 문자열 → YYYY. MM. DD. (null/파싱 실패 시 안전 폴백)
export const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// ISO 일시 문자열 → YYYY. MM. DD. HH:mm
export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 차트 라벨처럼 좁은 공간용 축약 표기 (1.2억 / 350만 / 9,500)
export const formatCompactKrw = (amount: number) => {
  if (amount >= 100_000_000) {
    return `${(amount / 100_000_000).toFixed(1).replace(/\.0$/, "")}억`;
  }
  if (amount >= 10_000) {
    return `${Math.round(amount / 10_000).toLocaleString("ko-KR")}만`;
  }
  return amount.toLocaleString("ko-KR");
};
