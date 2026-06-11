export const formatKrw = (amount: number) =>
  `₩${amount.toLocaleString("ko-KR")}`;

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
