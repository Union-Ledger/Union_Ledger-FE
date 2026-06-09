export const formatPresidentDashboardMoney = (value: string) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₩0";
  }

  return `₩${Math.round(amount).toLocaleString("ko-KR")}`;
};

export const formatPresidentDashboardDate = (value: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatPresidentDashboardRelativeTime = (
  value: string | null,
) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const diffMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60_000),
  );

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  return `${Math.floor(diffHours / 24)}일 전`;
};
