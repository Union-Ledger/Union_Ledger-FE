import useApi from "./useApi";
import { ENDPOINTS } from "../../config";

interface PostEvidenceData {
  settlementId: string;
  evidenceType: string;
  budgetCategory: string;
  file: File;
}

interface PostBankStatementData {
  settlementId: string;
  file: File;
}

interface PostResubmitSettlementData {
  settlementId: string;
  comment: string;
}

interface ExpenseSummaryCategory {
  category: string;
  count: number;
  amount: string;
}

export interface ExpenseSummaryResponse {
  settlement_id: string;
  total_count: number;
  total_amount: string;
  by_category: ExpenseSummaryCategory[];
}

export type ReconciliationStatus =
  | "matched"
  | "amount_mismatch"
  | "date_mismatch"
  | "missing_bank_transaction"
  | "missing_evidence";

export interface ReconciliationResult {
  id: string;
  settlement_id: string;
  evidence_id: string | null;
  bank_transaction_id: string | null;
  status: ReconciliationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReconciliationRunResponse {
  settlement_id: string;
  total: number;
  matched: number;
  amount_mismatch: number;
  date_mismatch: number;
  missing_bank_transaction: number;
  missing_evidence: number;
  results: ReconciliationResult[];
}

export interface SettlementResponse {
  id: string;
  organization_id: string;
  template_id: string;
  title: string;
  academic_year: number;
  semester: string;
  status: string;
  submitted_at: string | null;
  audited_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SettlementComment {
  id: string;
  settlement_id: string;
  evidence_id: string | null;
  author_membership_id: string;
  author_name?: string | null;
  comment: string;
  created_at: string;
  updated_at: string;
}

const useSettlementApi = () => {
  const { settlementApi } = useApi();

  // 증빙 파일 업로드
  const postEvidence = (data: PostEvidenceData) => {
    const formData = new FormData();

    formData.append("evidence_type", data.evidenceType);
    formData.append("budget_category", data.budgetCategory);
    formData.append("file", data.file);

    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.EVIDENCE(data.settlementId), formData)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("증빙 업로드 실패 status:", error.response?.status);
        console.log("증빙 업로드 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 결산안 상세 조회
  const getSettlement = (settlementId: string): Promise<SettlementResponse> => {
    return settlementApi
      .get(ENDPOINTS.SETTLEMENT.BASE(settlementId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("결산안 상세 조회 실패 status:", error.response?.status);
        console.log("결산안 상세 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 결산안 감사 코멘트 조회
  const getSettlementComments = (
    settlementId: string,
  ): Promise<SettlementComment[]> => {
    return settlementApi
      .get(ENDPOINTS.SETTLEMENT.COMMENT(settlementId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("결산안 코멘트 조회 실패 status:", error.response?.status);
        console.log("결산안 코멘트 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 결산안 지출 집계 조회
  const getExpenseSummary = (
    settlementId: string,
  ): Promise<ExpenseSummaryResponse> => {
    return settlementApi
      .get(ENDPOINTS.SETTLEMENT.EXPENSE_SUMMARY(settlementId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("지출 집계 조회 실패 status:", error.response?.status);
        console.log("지출 집계 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 증빙-거래내역 자동 대조 실행
  const postReconciliationRun = (
    settlementId: string,
  ): Promise<ReconciliationRunResponse> => {
    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.RECONCILIATION_RUN(settlementId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("자동 대조 실행 실패 status:", error.response?.status);
        console.log("자동 대조 실행 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 결산안 제출
  const postSubmitSettlement = (
    settlementId: string,
  ): Promise<SettlementResponse> => {
    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.SUBMIT(settlementId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("결산안 제출 실패 status:", error.response?.status);
        console.log("결산안 제출 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 결산안 공개 (회장 — 승인된 결산안을 학생에게 공개)
  const postPublishSettlement = (
    settlementId: string,
  ): Promise<SettlementResponse> => {
    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.PUBLISH(settlementId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("결산안 공개 실패 status:", error.response?.status);
        console.log("결산안 공개 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 반려 결산안 재제출
  const postResubmitSettlement = (
    data: PostResubmitSettlementData,
  ): Promise<SettlementResponse> => {
    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.RESUBMIT(data.settlementId), {
        comment: data.comment,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("결산안 재제출 실패 status:", error.response?.status);
        console.log("결산안 재제출 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 거래내역 엑셀 업로드 + 파싱
  const postBankStatement = (data: PostBankStatementData) => {
    const formData = new FormData();

    formData.append("file", data.file);

    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.BANK_STATEMENT(data.settlementId), formData)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("거래내역 업로드 실패 status:", error.response?.status);
        console.log("거래내역 업로드 실패 detail:", error.response?.data);
        throw error;
      });
  };

  return {
    postEvidence,
    getSettlement,
    getSettlementComments,
    getExpenseSummary,
    postReconciliationRun,
    postSubmitSettlement,
    postPublishSettlement,
    postResubmitSettlement,
    postBankStatement,
  };
};

export default useSettlementApi;
