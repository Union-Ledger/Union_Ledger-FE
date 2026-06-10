import useApi from "./useApi";
import { ENDPOINTS } from "../../config";

export interface AuditReconciliationSummary {
  matched: number;
  amount_mismatch: number;
  date_mismatch: number;
  missing_bank_transaction: number;
  missing_evidence: number;
  manually_resolved: number;
}

export interface AuditSettlementListItem {
  settlement_id: string;
  organization_id: string;
  organization_name: string;
  college_name: string;
  department_name: string;
  title: string;
  academic_year: number;
  semester: string;
  status: string;
  submitted_at: string | null;
  audited_at: string | null;
  evidence_count: number;
  bank_transaction_count: number;
  audit_comment_count: number;
  total_evidence_amount: string;
  reconciliation: AuditReconciliationSummary;
}

export interface AuditSettlement {
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

export interface AuditEvidence {
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

export interface AuditBankTransaction {
  id: string;
  upload_id: string;
  transaction_date: string;
  description: string;
  amount: string;
  created_at: string;
  updated_at: string;
}

export interface AuditReconciliationResult {
  id: string;
  settlement_id: string;
  evidence_id: string | null;
  bank_transaction_id: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditComment {
  id: string;
  settlement_id: string;
  evidence_id: string | null;
  author_membership_id: string | null;
  author_name?: string | null;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface AuditSettlementDetailResponse {
  settlement: AuditSettlement;
  evidences: AuditEvidence[];
  bank_transactions: AuditBankTransaction[];
  reconciliation_results: AuditReconciliationResult[];
  comments: AuditComment[];
}

interface PostAuditDecisionData {
  settlementId: string;
  comment: string;
}

interface PostAuditCommentData {
  settlementId: string;
  evidenceId: string;
  comment: string;
}

const useAuditApi = () => {
  const { auditApi, settlementApi, api } = useApi();

  const getAuditSettlements = (
    status?: string[],
  ): Promise<AuditSettlementListItem[]> => {
    return auditApi
      .get(ENDPOINTS.AUDIT.SETTLEMENT, {
        params: {
          status,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log(
          "감사 결산안 목록 조회 실패 status:",
          error.response?.status,
        );
        console.log("감사 결산안 목록 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  const getAuditSettlementDetail = (
    settlementId: string,
  ): Promise<AuditSettlementDetailResponse> => {
    return auditApi
      .get(ENDPOINTS.AUDIT.SETTLEMENT_DETAIL(settlementId))
      .then((response) => response.data)
      .catch((error) => {
        console.log(
          "감사 결산안 상세 조회 실패 status:",
          error.response?.status,
        );
        console.log("감사 결산안 상세 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 감사 코멘트 신규 작성 (항목별: evidenceId 지정 / 전체: 생략)
  const postAuditComment = (
    settlementId: string,
    comment: string,
    evidenceId?: string | null,
  ): Promise<AuditComment> => {
    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.COMMENT(settlementId), {
        comment,
        evidence_id: evidenceId ?? null,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("감사 코멘트 작성 실패 status:", error.response?.status);
        console.log("감사 코멘트 작성 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 증빙 원본 파일 다운로드 (조직 멤버 — 감사 모달용)
  const downloadEvidenceFile = (evidenceId: string): Promise<Blob> => {
    return api
      .get(ENDPOINTS.BASE.EVIDENCE_FILE(evidenceId), {
        responseType: "blob",
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("증빙 파일 다운로드 실패 status:", error.response?.status);
        console.log("증빙 파일 다운로드 실패 detail:", error.response?.data);
        throw error;
      });
  };

  const patchAuditComment = (commentId: string, comment: string) => {
    return auditApi
      .patch(ENDPOINTS.AUDIT.COMMENT(commentId), {
        comment,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("감사 코멘트 수정 실패 status:", error.response?.status);
        console.log("감사 코멘트 수정 실패 detail:", error.response?.data);
        throw error;
      });
  };

  const postAuditComment = ({
    settlementId,
    evidenceId,
    comment,
  }: PostAuditCommentData): Promise<AuditComment> => {
    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.COMMENT(settlementId), {
        evidence_id: evidenceId,
        comment,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("감사 코멘트 등록 실패 status:", error.response?.status);
        console.log("감사 코멘트 등록 실패 detail:", error.response?.data);
        throw error;
      });
  };

  const postApproveSettlement = ({
    settlementId,
    comment,
  }: PostAuditDecisionData): Promise<AuditSettlement> => {
    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.APPROVE(settlementId), {
        comment,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("결산안 승인 실패 status:", error.response?.status);
        console.log("결산안 승인 실패 detail:", error.response?.data);
        throw error;
      });
  };

  const postRejectSettlement = ({
    settlementId,
    comment,
  }: PostAuditDecisionData): Promise<AuditSettlement> => {
    return settlementApi
      .post(ENDPOINTS.SETTLEMENT.REJECT(settlementId), {
        comment,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("결산안 반려 실패 status:", error.response?.status);
        console.log("결산안 반려 실패 detail:", error.response?.data);
        throw error;
      });
  };

  return {
    getAuditSettlements,
    getAuditSettlementDetail,
    postAuditComment,
    downloadEvidenceFile,
    patchAuditComment,
    postApproveSettlement,
    postRejectSettlement,
  };
};

export default useAuditApi;
