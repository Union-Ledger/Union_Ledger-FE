export type ExpenseItem = {
  category: string;
  count: string;
  amount: string;
};

export const expenseItems: ExpenseItem[] = [
  { category: "행사비", count: "15건", amount: "₩3,200,000" },
  { category: "홍보비", count: "8건", amount: "₩1,800,000" },
  { category: "사무용품비", count: "12건", amount: "₩1,200,000" },
  { category: "교육비", count: "7건", amount: "₩1,500,000" },
  { category: "복리후생비", count: "5건", amount: "₩720,000" },
];
