import { ENDPOINTS } from "../../config";
import useApi from "./useApi";

export type StudentInvitationStatus =
  | "pending"
  | "accepted"
  | "expired"
  | "revoked"
  | "declined";

export interface StudentInvitation {
  id: string;
  organization_id: string;
  organization_name: string;
  college_name: string;
  department_name: string;
  invitation_type: string;
  role: string;
  status: StudentInvitationStatus;
  expires_at: string;
  created_at: string;
}

export interface AcceptedInvitation {
  id: string;
  organization_id: string;
  invited_email: string;
  invitation_type: string;
  role: string;
  status: StudentInvitationStatus;
  expires_at: string;
  created_at: string;
  code: string;
}

export interface AdminApplicationDocument {
  file_name: string;
  content_type: string;
  size: number;
}

export interface AdminApplication {
  id: string;
  applicant_user_id: string;
  applicant_name: string;
  applicant_email: string;
  organization_name: string;
  college_name: string;
  department_name: string;
  documents: AdminApplicationDocument[];
  status: string;
  review_note: string | null;
  reviewed_at: string | null;
  created_organization_id: string | null;
  created_at: string;
}

interface PostAdminApplicationData {
  organizationName: string;
  collegeName: string;
  departmentName: string;
  documents: File[];
}

const useStudentApi = () => {
  const { api } = useApi();

  const getMyInvitations = (): Promise<StudentInvitation[]> => {
    return api
      .get(ENDPOINTS.INVITATION.ME)
      .then((response) => response.data)
      .catch((error) => {
        console.log("받은 초대 목록 조회 실패 status:", error.response?.status);
        console.log("받은 초대 목록 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  const postAcceptInvitation = (
    invitationId: string,
  ): Promise<AcceptedInvitation> => {
    return api
      .post(ENDPOINTS.INVITATION.ACCEPT(invitationId))
      .then((response) => response.data)
      .catch((error) => {
        console.log("초대 수락 실패 status:", error.response?.status);
        console.log("초대 수락 실패 detail:", error.response?.data);
        throw error;
      });
  };

  const postDeclineInvitation = (
    invitationId: string,
  ): Promise<AcceptedInvitation> => {
    return api
      .post(ENDPOINTS.INVITATION.DECLINE(invitationId))
      .then((response) => response.data)
      .catch((error) => {
        console.log("초대 거절 실패 status:", error.response?.status);
        console.log("초대 거절 실패 detail:", error.response?.data);
        throw error;
      });
  };

  const postAdminApplication = (
    data: PostAdminApplicationData,
  ): Promise<AdminApplication> => {
    const formData = new FormData();

    formData.append("organization_name", data.organizationName);
    formData.append("college_name", data.collegeName);
    formData.append("department_name", data.departmentName);
    data.documents.forEach((document) => {
      formData.append("documents", document);
    });

    return api
      .post(ENDPOINTS.ADMIN_APPLICATION.CREATE, formData)
      .then((response) => response.data)
      .catch((error) => {
        console.log("회장 신청 실패 status:", error.response?.status);
        console.log("회장 신청 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 내 회장 신청 목록 (최신순) — 신청 페이지에서 진행 상태 표시에 사용
  const getMyAdminApplications = (): Promise<AdminApplication[]> => {
    return api
      .get(ENDPOINTS.ADMIN_APPLICATION.MINE)
      .then((response) => response.data)
      .catch((error) => {
        console.log("내 회장 신청 조회 실패 status:", error.response?.status);
        console.log("내 회장 신청 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  const getAdminApplication = (
    applicationId: string,
  ): Promise<AdminApplication> => {
    return api
      .get(ENDPOINTS.ADMIN_APPLICATION.DETAIL(applicationId))
      .then((response) => response.data)
      .catch((error) => {
        console.log("회장 신청 상세 조회 실패 status:", error.response?.status);
        console.log("회장 신청 상세 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  return {
    getMyInvitations,
    postAcceptInvitation,
    postDeclineInvitation,
    postAdminApplication,
    getMyAdminApplications,
    getAdminApplication,
  };
};

export default useStudentApi;
