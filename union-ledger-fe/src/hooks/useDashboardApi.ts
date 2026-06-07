import useApi from "./useApi";
import { ENDPOINTS } from "../../config";

export interface RecentSettlement {
  settlement_id: string;
  organization_id: string;
  organization_name: string;
  title: string;
  academic_year: number;
  semester: string;
  status: string;
  submitted_at: string | null;
  audited_at: string | null;
  evidence_count: number;
  bank_transaction_count: number;
  matched_count: number;
  unmatched_count: number;
  total_evidence_amount: string;
  progress_percent: number;
}

export interface TreasurerDashboardResponse {
  organization_count: number;
  settlement_counts_by_status: Record<string, number>;
  total_evidence_count: number;
  total_evidence_amount: string;
  matched_count: number;
  unmatched_count: number;
  progress_percent: number;
  recent_settlements: RecentSettlement[];
}

export interface AuditorPendingSettlement {
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
  reconciliation: {
    matched: number;
    amount_mismatch: number;
    date_mismatch: number;
    missing_bank_transaction: number;
    missing_evidence: number;
    manually_resolved: number;
  };
}

export interface AuditorDashboardResponse {
  organization_count: number;
  settlement_counts_by_status: Record<string, number>;
  pending_count: number;
  in_progress_count: number;
  completed_count: number;
  pending_settlements: AuditorPendingSettlement[];
}

const useDashboardApi = () => {
  const { dashboardApi } = useApi();

  // 재정담당자 대시보드 조회
  const getTreasurerDashboard = (
    recentLimit = 10,
  ): Promise<TreasurerDashboardResponse | undefined> => {
    return dashboardApi
      .get(ENDPOINTS.DASHBOARD.TREASURER, {
        params: {
          recent_limit: recentLimit,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(
          "재정담당자 대시보드 조회 실패 status:",
          error.response?.status,
        );
        console.log(
          "재정담당자 대시보드 조회 실패 detail:",
          error.response?.data,
        );
        throw error;
      });
  };

  // 감사위원 대시보드 조회
  const getAuditorDashboard = (
    pendingLimit = 10,
  ): Promise<AuditorDashboardResponse | undefined> => {
    return dashboardApi
      .get(ENDPOINTS.DASHBOARD.AUDITOR, {
        params: {
          pending_limit: pendingLimit,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(
          "감사위원 대시보드 조회 실패 status:",
          error.response?.status,
        );
        console.log(
          "감사위원 대시보드 조회 실패 detail:",
          error.response?.data,
        );
        throw error;
      });
  };

  return {
    getTreasurerDashboard,
    getAuditorDashboard,
  };
};

export default useDashboardApi;
