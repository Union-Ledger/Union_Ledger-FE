import useApi from "./useApi";
import { ENDPOINTS } from "../../config";

interface PostEvidenceData {
  settlementId: string;
  evidenceType: string;
  budgetCategory: string;
  groupName: string;
  file: File;
}

interface PostBankStatementData {
  settlementId: string;
  file: File;
}

export interface BankStatementUploadResponse {
  id: string;
  settlement_id: string;
  source_file_name: string;
  source_file_path: string;
  status: string;
  parsed_rows_count: number;
  created_at: string;
  updated_at: string;
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
  academic_year: number;
  semester: string;
  period_start: string;
  period_end: string;
  total_count: number;
  total_amount: string;
  by_category: ExpenseSummaryCategory[];
}

export type ReconciliationStatus =
  | "matched"
  | "amount_mismatch"
  | "date_mismatch"
  | "missing_bank_transaction"
  | "missing_evidence"
  | "manually_resolved";

export interface ReconciliationResult {
  id: string;
  settlement_id: string;
  evidence_id: string | null;
  bank_transaction_id: string | null;
  status: ReconciliationStatus;
  notes: string | null;
  evidence_merchant_name: string | null;
  bank_merchant_name: string | null;
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
  manually_resolved: number;
  results: ReconciliationResult[];
}

export interface ReconciliationUpdatePayload {
  evidence_id?: string | null;
  bank_transaction_id?: string | null;
  status?: ReconciliationStatus;
  notes?: string | null;
}

export type ArtifactType = "settlement_excel" | "evidence_pdf";
export type ArtifactStatus = "queued" | "processing" | "completed" | "failed";

export interface SettlementArtifact {
  id: string;
  settlement_id: string;
  artifact_type: ArtifactType;
  status: ArtifactStatus;
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArtifactGenerationResponse {
  excel: SettlementArtifact;
  pdf: SettlementArtifact;
  excel_error?: string | null;
  pdf_error?: string | null;
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
  const { api, settlementApi } = useApi();

  // 증빙 파일 업로드
  const postEvidence = (data: PostEvidenceData) => {
    const formData = new FormData();

    formData.append("evidence_type", data.evidenceType);
    formData.append("budget_category", data.budgetCategory);
    formData.append("group_name", data.groupName);
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

  // 증빙-거래내역 대조 결과 조회
  const getReconciliationResults = (
    settlementId: string,
    status?: ReconciliationStatus,
  ): Promise<ReconciliationResult[]> => {
    return settlementApi
      .get(ENDPOINTS.SETTLEMENT.RECONCILIATION(settlementId), {
        params: status ? { status } : undefined,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("대조 결과 조회 실패 status:", error.response?.status);
        console.log("대조 결과 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 대조 결과 수동 조정 (PATCH /reconciliation/{matchId})
  const patchReconciliationResult = (
    matchId: string,
    payload: ReconciliationUpdatePayload,
  ): Promise<ReconciliationResult> => {
    return api
      .patch(ENDPOINTS.BASE.RECONCILIATION_RESULT(matchId), payload)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("대조 결과 수정 실패 status:", error.response?.status);
        console.log("대조 결과 수정 실패 detail:", error.response?.data);
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

  // 결산안 산출물(Excel + 증빙 PDF) 생성
  const postGenerateArtifacts = (
    settlementId: string,
  ): Promise<ArtifactGenerationResponse> => {
    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.ARTIFACT_GENERATE(settlementId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("산출물 생성 실패 status:", error.response?.status);
        console.log("산출물 생성 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 결산안 산출물 목록 조회
  const getArtifacts = (
    settlementId: string,
  ): Promise<SettlementArtifact[]> => {
    return settlementApi
      .get(ENDPOINTS.SETTLEMENT.ARTIFACT_LIST(settlementId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("산출물 목록 조회 실패 status:", error.response?.status);
        console.log("산출물 목록 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 산출물 파일 다운로드 (멤버 전용, /artifacts/{id}/download)
  const downloadArtifact = (artifactId: string): Promise<Blob> => {
    return api
      .get(ENDPOINTS.BASE.ARTIFACT_DOWNLOAD(artifactId), {
        responseType: "blob",
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("산출물 다운로드 실패 status:", error.response?.status);
        console.log("산출물 다운로드 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 거래내역 엑셀 업로드 + 파싱
  const postBankStatement = (
    data: PostBankStatementData,
  ): Promise<BankStatementUploadResponse> => {
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

  // 업로드한 거래내역서 목록 조회
  const getBankStatements = (
    settlementId: string,
  ): Promise<BankStatementUploadResponse[]> => {
    return settlementApi
      .get(ENDPOINTS.SETTLEMENT.BANK_STATEMENT(settlementId))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("거래내역 목록 조회 실패 status:", error.response?.status);
        console.log("거래내역 목록 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 업로드한 거래내역서 삭제
  const deleteBankStatement = (uploadId: string) => {
    return api
      .delete(ENDPOINTS.BASE.BANK_STATEMENT(uploadId))
      .then(() => undefined)
      .catch((error) => {
        console.log("거래내역 삭제 실패 status:", error.response?.status);
        console.log("거래내역 삭제 실패 detail:", error.response?.data);
        throw error;
      });
  };

  return {
    postEvidence,
    getSettlement,
    getSettlementComments,
    getExpenseSummary,
    postReconciliationRun,
    getReconciliationResults,
    patchReconciliationResult,
    postSubmitSettlement,
    postPublishSettlement,
    postResubmitSettlement,
    postBankStatement,
    getBankStatements,
    deleteBankStatement,
    postGenerateArtifacts,
    getArtifacts,
    downloadArtifact,
  };
};

export default useSettlementApi;
