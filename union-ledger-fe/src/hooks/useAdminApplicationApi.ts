import { useCallback } from "react";
import { ENDPOINTS } from "../../config";
import useApi from "./useApi";
import type { AdminApplication } from "./useStudentApi";

type AdminApplicationStatus = "pending" | "approved" | "rejected";

interface ReviewAdminApplicationResponse {
  application: AdminApplication;
  organization_id: string;
}

const useAdminApplicationApi = () => {
  const { api } = useApi();

  const getAdminApplications = useCallback((
    status?: AdminApplicationStatus,
  ): Promise<AdminApplication[]> => {
    return api
      .get(ENDPOINTS.ADMIN_APPLICATION.LIST, {
        params: status ? { status } : undefined,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("회장 신청 목록 조회 실패 status:", error.response?.status);
        console.log("회장 신청 목록 조회 실패 detail:", error.response?.data);
        throw error;
      });
  }, [api]);

  const downloadAdminApplicationDocument = useCallback((
    applicationId: string,
    index: number,
  ): Promise<Blob> => {
    return api
      .get(ENDPOINTS.ADMIN_APPLICATION.DOCUMENT(applicationId, index), {
        responseType: "blob",
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("회장 신청 서류 다운로드 실패 status:", error.response?.status);
        console.log("회장 신청 서류 다운로드 실패 detail:", error.response?.data);
        throw error;
      });
  }, [api]);

  const approveAdminApplication = useCallback((
    applicationId: string,
    note: string,
  ): Promise<ReviewAdminApplicationResponse> => {
    return api
      .post(ENDPOINTS.ADMIN_APPLICATION.APPROVE(applicationId), { note })
      .then((response) => response.data)
      .catch((error) => {
        console.log("회장 신청 승인 실패 status:", error.response?.status);
        console.log("회장 신청 승인 실패 detail:", error.response?.data);
        throw error;
      });
  }, [api]);

  const rejectAdminApplication = useCallback((
    applicationId: string,
    note: string,
  ): Promise<AdminApplication> => {
    return api
      .post(ENDPOINTS.ADMIN_APPLICATION.REJECT(applicationId), { note })
      .then((response) => response.data)
      .catch((error) => {
        console.log("회장 신청 반려 실패 status:", error.response?.status);
        console.log("회장 신청 반려 실패 detail:", error.response?.data);
        throw error;
      });
  }, [api]);

  return {
    getAdminApplications,
    downloadAdminApplicationDocument,
    approveAdminApplication,
    rejectAdminApplication,
  };
};

export default useAdminApplicationApi;
