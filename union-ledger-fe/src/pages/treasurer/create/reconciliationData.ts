export type ReconciliationStatus = "matched" | "issue";

export interface ReconciliationItem {
  id: number;
  date: string;
  category: string;
  merchantName: string;
  amount: number;
  status: ReconciliationStatus;
  issueMessage?: string;
}

export const reconciliationItems: ReconciliationItem[] = [
  {
    id: 1,
    date: "2026-03-20",
    category: "행사비",
    merchantName: "스타벅스 건국대점",
    amount: 15000,
    status: "matched",
  },
  {
    id: 2,
    date: "2026-03-19",
    category: "사무용품비",
    merchantName: "교보문고",
    amount: 45000,
    status: "matched",
  },
  {
    id: 3,
    date: "2026-03-18",
    category: "복리후생비",
    merchantName: "GS25",
    amount: 8500,
    status: "issue",
    issueMessage: "증빙 금액 불일치",
  },
  {
    id: 4,
    date: "2026-03-17",
    category: "행사비",
    merchantName: "카페베네",
    amount: 12000,
    status: "matched",
  },
  {
    id: 5,
    date: "2026-03-16",
    category: "사무용품비",
    merchantName: "다이소",
    amount: 25000,
    status: "matched",
  },
];
