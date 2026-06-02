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
    getExpenseSummary,
    postBankStatement,
  };
};

export default useSettlementApi;
