import { ENDPOINTS } from "../../config";
import useApi from "./useApi";
import { useCallback } from "react";

export interface PublicSettlementListItem {
  id: string;
  organization_id: string;
  organization_name: string;
  college_name: string;
  department_name: string;
  title: string;
  academic_year: number;
  semester: string;
  published_at: string | null;
  total_amount: string;
  item_count: number;
}

export interface PublicSettlementArtifact {
  id: string;
  artifact_type: string;
  status: string;
  created_at: string;
}

export interface PublicSettlementDetail extends PublicSettlementListItem {
  submitted_at: string | null;
  audited_at: string | null;
  artifacts: PublicSettlementArtifact[];
}

export interface PublicSettlementItem {
  evidence_id: string;
  evidence_type: string;
  evidence_date: string | null;
  merchant_name: string | null;
  amount: string;
  payment_method: string | null;
  budget_category: string | null;
  has_evidence_file: boolean;
}

export interface PublicEvidenceMetadata {
  id: string;
  settlement_id: string;
  evidence_type: string;
  evidence_date: string | null;
  merchant_name: string | null;
  amount: string;
  payment_method: string | null;
  budget_category: string | null;
  source_file_name: string | null;
  has_evidence_file: boolean;
}

const usePublicSettlementApi = () => {
  const { publicApi } = useApi();

  const getPublicSettlements = useCallback((): Promise<PublicSettlementListItem[]> => {
    return publicApi
      .get(ENDPOINTS.PUBLIC.SETTLEMENTS)
      .then((response) => response.data)
      .catch((error) => {
        console.log("공개 결산안 목록 조회 실패 status:", error.response?.status);
        console.log("공개 결산안 목록 조회 실패 detail:", error.response?.data);
        throw error;
      });
  }, [publicApi]);

  const getPublicSettlementDetail = useCallback((
    settlementId: string,
  ): Promise<PublicSettlementDetail> => {
    return publicApi
      .get(ENDPOINTS.PUBLIC.SETTLEMENT_DETAIL(settlementId))
      .then((response) => response.data)
      .catch((error) => {
        console.log("공개 결산안 상세 조회 실패 status:", error.response?.status);
        console.log("공개 결산안 상세 조회 실패 detail:", error.response?.data);
        throw error;
      });
  }, [publicApi]);

  const getPublicSettlementItems = useCallback((
    settlementId: string,
  ): Promise<PublicSettlementItem[]> => {
    return publicApi
      .get(ENDPOINTS.PUBLIC.SETTLEMENT_ITEMS(settlementId))
      .then((response) => response.data)
      .catch((error) => {
        console.log("공개 결산안 항목 조회 실패 status:", error.response?.status);
        console.log("공개 결산안 항목 조회 실패 detail:", error.response?.data);
        throw error;
      });
  }, [publicApi]);

  const getPublicEvidence = useCallback((
    evidenceId: string,
  ): Promise<PublicEvidenceMetadata> => {
    return publicApi
      .get(ENDPOINTS.PUBLIC.EVIDENCE(evidenceId))
      .then((response) => response.data)
      .catch((error) => {
        console.log("공개 증빙 메타데이터 조회 실패 status:", error.response?.status);
        console.log("공개 증빙 메타데이터 조회 실패 detail:", error.response?.data);
        throw error;
      });
  }, [publicApi]);

  const downloadPublicEvidenceFile = useCallback((evidenceId: string): Promise<Blob> => {
    return publicApi
      .get(ENDPOINTS.PUBLIC.EVIDENCE_FILE(evidenceId), {
        responseType: "blob",
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("공개 증빙 원본 파일 다운로드 실패 status:", error.response?.status);
        console.log("공개 증빙 원본 파일 다운로드 실패 detail:", error.response?.data);
        throw error;
      });
  }, [publicApi]);

  const downloadPublicSettlementArtifact = useCallback((
    settlementId: string,
    artifactId: string,
  ): Promise<Blob> => {
    return publicApi
      .get(ENDPOINTS.PUBLIC.SETTLEMENT_DOWNLOAD(settlementId, artifactId), {
        responseType: "blob",
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("공개 결산안 산출물 다운로드 실패 status:", error.response?.status);
        console.log("공개 결산안 산출물 다운로드 실패 detail:", error.response?.data);
        throw error;
      });
  }, [publicApi]);

  return {
    getPublicSettlements,
    getPublicSettlementDetail,
    getPublicSettlementItems,
    getPublicEvidence,
    downloadPublicEvidenceFile,
    downloadPublicSettlementArtifact,
  };
};

export default usePublicSettlementApi;
