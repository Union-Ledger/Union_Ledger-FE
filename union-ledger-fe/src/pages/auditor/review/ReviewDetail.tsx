import { useMemo, useState } from "react";
import * as styles from "@/pages/auditor/review/ReviewDetail.css";

type SettlementStatus = "draft" | "submitted" | "audited" | "published";

interface Settlement {
  id: string;
  organization_id: string;
  template_id: string;
  title: string;
  academic_year: number;
  semester: string;
  status: SettlementStatus;
  submitted_at: string | null;
  audited_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Evidence {
  id: string;
  settlement_id: string;
  organization_id: string;
  evidence_type: string;
  status: string;
  extraction_method: string;
  source_file_name: string;
  source_file_path: string;
  extracted_payload: Record<string, unknown>;
  evidence_date: string;
  merchant_name: string;
  amount: string;
  payment_method: string;
  budget_category: string;
  created_at: string;
  updated_at: string;
}

interface BankTransaction {
  id: string;
  upload_id: string;
  transaction_date: string;
  description: string;
  amount: string;
  created_at: string;
  updated_at: string;
}

interface ReconciliationResult {
  id: string;
  settlement_id: string;
  evidence_id: string;
  bank_transaction_id: string;
  status: "matched" | "unmatched" | "pending";
  notes: string;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: string;
  settlement_id: string;
  evidence_id: string;
  author_membership_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

interface SettlementReviewResponse {
  settlement: Settlement;
  evidences: Evidence[];
  bank_transactions: BankTransaction[];
  reconciliation_results: ReconciliationResult[];
  comments: Comment[];
}

const reviewDetailDummyData: SettlementReviewResponse = {
  settlement: {
    id: "settlement-1",
    organization_id: "organization-1",
    template_id: "template-1",
    title: "결산안 검토: 컴퓨터공학과 학생회",
    academic_year: 2024,
    semester: "2학기",
    status: "submitted",
    submitted_at: "2026-03-18T00:00:00Z",
    audited_at: null,
    published_at: null,
    created_at: "2026-03-18T00:00:00Z",
    updated_at: "2026-03-18T00:00:00Z",
  },
  evidences: [
    {
      id: "evidence-1",
      settlement_id: "settlement-1",
      organization_id: "organization-1",
      evidence_type: "physical_receipt",
      status: "uploaded",
      extraction_method: "ocr",
      source_file_name: "receipt-1.png",
      source_file_path: "/receipts/receipt-1.png",
      extracted_payload: {},
      evidence_date: "2026-03-20",
      merchant_name: "스타벅스 건국대점",
      amount: "15000",
      payment_method: "card",
      budget_category: "행사비",
      created_at: "2026-03-20T00:00:00Z",
      updated_at: "2026-03-20T00:00:00Z",
    },
    {
      id: "evidence-2",
      settlement_id: "settlement-1",
      organization_id: "organization-1",
      evidence_type: "physical_receipt",
      status: "uploaded",
      extraction_method: "ocr",
      source_file_name: "receipt-2.png",
      source_file_path: "/receipts/receipt-2.png",
      extracted_payload: {},
      evidence_date: "2026-03-19",
      merchant_name: "교보문고 광화문점",
      amount: "45000",
      payment_method: "card",
      budget_category: "사무용품비",
      created_at: "2026-03-19T00:00:00Z",
      updated_at: "2026-03-19T00:00:00Z",
    },
  ],
  bank_transactions: [
    {
      id: "bank-transaction-1",
      upload_id: "upload-1",
      transaction_date: "2026-03-20",
      description: "스타벅스 건국대점",
      amount: "-15000",
      created_at: "2026-03-20T00:00:00Z",
      updated_at: "2026-03-20T00:00:00Z",
    },
    {
      id: "bank-transaction-2",
      upload_id: "upload-1",
      transaction_date: "2026-03-19",
      description: "교보문고 광화문점",
      amount: "-45000",
      created_at: "2026-03-19T00:00:00Z",
      updated_at: "2026-03-19T00:00:00Z",
    },
  ],
  reconciliation_results: [
    {
      id: "reconciliation-1",
      settlement_id: "settlement-1",
      evidence_id: "evidence-1",
      bank_transaction_id: "bank-transaction-1",
      status: "matched",
      notes: "",
      created_at: "2026-03-20T00:00:00Z",
      updated_at: "2026-03-20T00:00:00Z",
    },
    {
      id: "reconciliation-2",
      settlement_id: "settlement-1",
      evidence_id: "evidence-2",
      bank_transaction_id: "bank-transaction-2",
      status: "matched",
      notes: "",
      created_at: "2026-03-19T00:00:00Z",
      updated_at: "2026-03-19T00:00:00Z",
    },
  ],
  comments: [],
};

const parseAmount = (amount: string) => {
  const parsed = Number(amount);
  return Number.isNaN(parsed) ? 0 : Math.abs(parsed);
};

const formatMoney = (amount: number) => {
  return `₩${amount.toLocaleString("ko-KR")}`;
};

const transformReviewDetail = (data: SettlementReviewResponse) => {
  const totalAmount = data.evidences.reduce((sum, evidence) => {
    return sum + parseAmount(evidence.amount);
  }, 0);

  const categoryMap = new Map<
    string,
    {
      category: string;
      count: number;
      totalAmount: number;
    }
  >();

  data.evidences.forEach((evidence) => {
    const category = evidence.budget_category || "미분류";
    const prev = categoryMap.get(category);

    categoryMap.set(category, {
      category,
      count: (prev?.count ?? 0) + 1,
      totalAmount: (prev?.totalAmount ?? 0) + parseAmount(evidence.amount),
    });
  });

  const transactions = data.evidences.map((evidence) => {
    const reconciliation = data.reconciliation_results.find(
      (result) => result.evidence_id === evidence.id,
    );

    const bankTransaction = data.bank_transactions.find(
      (transaction) => transaction.id === reconciliation?.bank_transaction_id,
    );

    const comment = data.comments.find(
      (comment) => comment.evidence_id === evidence.id,
    );

    return {
      id: evidence.id,
      date: evidence.evidence_date || bankTransaction?.transaction_date,
      category: evidence.budget_category,
      merchantName: evidence.merchant_name || bankTransaction?.description,
      amount: parseAmount(evidence.amount),
      comment: comment?.comment ?? "",
    };
  });

  return {
    settlement: {
      ...data.settlement,
      totalAmount,
    },
    categorySummaries: Array.from(categoryMap.values()),
    transactions,
  };
};

const ReviewDetail = () => {
  const [auditComment, setAuditComment] = useState("");

  const reviewData = useMemo(() => {
    return transformReviewDetail(reviewDetailDummyData);
  }, []);

  const handleApprove = () => {
    console.log("승인", auditComment);
  };

  const handleReject = () => {
    console.log("반려", auditComment);
  };

  return (
    <div className={styles.container}>
      <button type="button" className={styles.backButton}>
        ← 목록으로
      </button>

      <div className={styles.headerContainer}>
        <div>
          <h1 className={styles.title}>{reviewData.settlement.title}</h1>
          <p className={styles.desc}>
            {reviewData.settlement.academic_year}-
            {reviewData.settlement.semester}
          </p>
        </div>

        <div className={styles.totalAmountWrapper}>
          <span className={styles.totalAmountLabel}>총 지출액</span>
          <strong className={styles.totalAmount}>
            {formatMoney(reviewData.settlement.totalAmount)}
          </strong>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>📄 결산안</span>
          </div>

          <div className={styles.panelBody}>
            <h2 className={styles.sectionTitle}>항목별 지출 내역</h2>

            <div className={styles.categoryList}>
              {reviewData.categorySummaries.map((item) => (
                <div key={item.category} className={styles.categoryItem}>
                  <div>
                    <strong className={styles.categoryName}>
                      {item.category}
                    </strong>
                    <p className={styles.categoryCount}>{item.count}건</p>
                  </div>

                  <strong className={styles.categoryAmount}>
                    {formatMoney(item.totalAmount)}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>🧾 거래 내역 상세</span>
          </div>

          <div className={styles.panelBody}>
            <div className={styles.transactionList}>
              {reviewData.transactions.map((transaction) => (
                <div key={transaction.id} className={styles.transactionItem}>
                  <div className={styles.transactionTop}>
                    <span className={styles.transactionDate}>
                      {transaction.date}
                    </span>
                    <span className={styles.categoryBadge}>
                      {transaction.category}
                    </span>
                  </div>

                  <strong className={styles.merchantName}>
                    {transaction.merchantName}
                  </strong>

                  <strong className={styles.transactionAmount}>
                    {formatMoney(transaction.amount)}
                  </strong>

                  <div className={styles.commentBox}>
                    <span className={styles.commentIcon}>▱</span>
                    <input
                      className={styles.commentInput}
                      placeholder="이 항목에 대한 코멘트 (선택사항)"
                      defaultValue={transaction.comment}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className={styles.auditPanel}>
        <h2 className={styles.sectionTitle}>전체 감사 의견</h2>

        <textarea
          className={styles.auditTextarea}
          placeholder="결산안 전체에 대한 최종 의견을 작성하세요 (반려 시 필수)"
          value={auditComment}
          onChange={(event) => setAuditComment(event.target.value)}
        />

        <div className={styles.actionContainer}>
          <button
            type="button"
            className={styles.approveButton}
            onClick={handleApprove}
          >
            ◎ 승인
          </button>

          <button
            type="button"
            className={styles.rejectButton}
            onClick={handleReject}
          >
            ⊗ 반려
          </button>
        </div>
      </section>
    </div>
  );
};

export default ReviewDetail;
