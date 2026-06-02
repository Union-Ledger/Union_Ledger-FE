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

  return {
    getTreasurerDashboard,
  };
};

export default useDashboardApi;
