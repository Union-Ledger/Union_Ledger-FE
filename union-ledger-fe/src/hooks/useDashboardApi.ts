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

export interface StudentDashboardOrganization {
  id: string | null;
  name: string;
  college_name: string;
  department_name: string;
}

export interface StudentDashboardSummary {
  published_settlement_count: number;
  current_period_total_amount: string;
  last_published_at: string | null;
  total_view_count: number;
}

export interface StudentRecentAuditResult {
  settlement_id: string;
  academic_year: number;
  semester: string;
  label: string;
  status: string;
  status_label: string;
  total_amount: string;
  audited_at: string | null;
  published_at: string | null;
  summary_comment: string | null;
}

export interface StudentProgressStep {
  key: string;
  label: string;
  state: string;
  completed_at: string | null;
}

export interface StudentCurrentPeriod {
  settlement_id: string | null;
  academic_year: number;
  semester: string;
  label: string;
  status: string | null;
  status_label: string;
  is_published: boolean;
  total_amount: string;
  evidence_count: number;
  submitted_at: string | null;
  audited_at: string | null;
  published_at: string | null;
  steps: StudentProgressStep[];
}

// 같은 학기, 같은 단과대 내 모든 학생회 카드 (우리 학과가 먼저). 비교 차트용.
export interface PeriodSettlementCard {
  id: string | null;
  organization_id: string;
  is_my_organization: boolean;
  organization_name: string;
  college_name: string;
  department_name: string;
  academic_year: number;
  semester: string;
  label: string;
  status: string | null;
  status_label: string;
  is_published: boolean;
  audited_at: string | null;
  published_at: string | null;
  total_amount: string | null;
  evidence_count: number | null;
  view_count: number | null;
}

export interface StudentDashboardResponse {
  organization: StudentDashboardOrganization;
  summary: StudentDashboardSummary;
  current_period: StudentCurrentPeriod;
  college_period_overview: PeriodSettlementCard[];
  recent_results: StudentRecentAuditResult[];
}

export interface PresidentDashboardOrganization {
  id: string;
  name: string;
  college_name: string;
  department_name: string;
  president_name: string;
  academic_year: number;
  semester: string;
  current_period_label: string;
}

export interface PresidentTreasurerWork {
  settlement_id: string;
  title: string;
  academic_year: number;
  semester: string;
  semester_label: string;
  status: string;
  status_label: string;
  progress_percent: number;
  total_expense: string;
  evidence_count: number;
  submitted_at: string | null;
  audited_at: string | null;
  last_activity_at: string | null;
}

export interface PresidentAuditorActivity {
  user_id: string;
  name: string;
  email: string;
  assigned_count: number;
  completed_count: number;
  pending_count: number;
  avg_review_days: number;
  last_activity_at: string | null;
}

export interface PresidentDashboardMember {
  user_id: string;
  name: string;
  email: string;
  role: string;
  is_primary: boolean;
}

export interface PresidentDashboardResponse {
  organization: PresidentDashboardOrganization;
  team_member_count: number;
  submitted_settlement_count: number;
  audit_completed_count: number;
  review_pending_count: number;
  treasurer_work: PresidentTreasurerWork[];
  auditor_activity: PresidentAuditorActivity[];
  members: PresidentDashboardMember[];
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

  // 학생 대시보드 조회 (미지정 시 본인 학과 학생회 기준)
  const getStudentDashboard = (
    organizationId?: string,
  ): Promise<StudentDashboardResponse | undefined> => {
    return dashboardApi
      .get(ENDPOINTS.DASHBOARD.STUDENT, {
        params: organizationId ? { organization_id: organizationId } : {},
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("학생 대시보드 조회 실패 status:", error.response?.status);
        console.log("학생 대시보드 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 회장 대시보드 조회
  const getPresidentDashboard = (
    organizationId?: string,
    recentLimit = 10,
  ): Promise<PresidentDashboardResponse | undefined> => {
    return dashboardApi
      .get(ENDPOINTS.DASHBOARD.PRESIDENT, {
        params: {
          ...(organizationId ? { organization_id: organizationId } : {}),
          recent_limit: recentLimit,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("회장 대시보드 조회 실패 status:", error.response?.status);
        console.log("회장 대시보드 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  return {
    getTreasurerDashboard,
    getAuditorDashboard,
    getStudentDashboard,
    getPresidentDashboard,
  };
};

export default useDashboardApi;
