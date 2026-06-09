import useApi from "./useApi";
import { ENDPOINTS } from "../../config";

interface PostTemplateData {
  organizationId: string;
  name: string;
  file: File;
  mappingSchema?: Record<string, unknown>;
}

interface PatchTemplateData {
  templateId: string;
  name: string;
  mappingSchema: Record<string, unknown>;
  isActive: boolean;
}

type Semester = "1" | "2" | "summer" | "winter";

interface PostSettlementData {
  organizationId: string;
  templateId: string;
  title: string;
  academicYear: number;
  semester: Semester;
}

interface PostInvitationData {
  organizationId: string;
  invitedEmail: string;
  invitationType: string;
  role: string;
}

export interface TemplateData {
  id: string;
  organization_id: string;
  name: string;
  original_filename: string;
  mapping_schema: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface OrganizationData {
  id: string;
  name: string;
  college_name: string;
  department_name: string;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  invited_email: string;
  invitation_type: string;
  role: string;
  status: "pending" | "accepted" | "rejected";
  expires_at: string;
  created_at: string;
  code: string;
}

const useOrganizationApi = () => {
  const { api, organizationApi } = useApi();

  // 조직 목록 조회
  const getOrganization = (): Promise<OrganizationData[] | undefined> => {
    return organizationApi
      .get(ENDPOINTS.ORGANIZATION.LIST)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log(error));
  };

  // 결산 템플릿 업로드
  const postTemplate = (data: PostTemplateData): Promise<TemplateData> => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("file", data.file);
    formData.append("mapping_schema", JSON.stringify(data.mappingSchema ?? {}));

    return organizationApi
      .post(ENDPOINTS.ORGANIZATION.TEMPLATE(data.organizationId), formData)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("템플릿 업로드 실패 status:", error.response?.status);
        console.log("템플릿 업로드 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 조직 템플릿 목록
  const getTemplate = (id: string): Promise<TemplateData[] | undefined> => {
    return organizationApi
      .get(ENDPOINTS.ORGANIZATION.TEMPLATE(id))
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log(error));
  };

  // 결산 템플릿 수정
  const patchTemplate = (data: PatchTemplateData): Promise<TemplateData> => {
    return api
      .patch(ENDPOINTS.BASE.TEMPLATE(data.templateId), {
        name: data.name,
        mapping_schema: data.mappingSchema,
        is_active: data.isActive,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("템플릿 수정 실패 status:", error.response?.status);
        console.log("템플릿 수정 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 결산 템플릿 삭제 (soft delete — is_active=false)
  const deleteTemplate = (templateId: string): Promise<void> => {
    return api
      .delete(ENDPOINTS.BASE.TEMPLATE(templateId))
      .then(() => undefined)
      .catch((error) => {
        console.log("템플릿 삭제 실패 status:", error.response?.status);
        console.log("템플릿 삭제 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 결산안 draft 생성
  const postSettlement = (data: PostSettlementData) => {
    const body = {
      template_id: data.templateId,
      title: data.title,
      academic_year: data.academicYear,
      semester: data.semester,
    };

    console.log("결산안 생성 요청 body:", body);

    return organizationApi
      .post(ENDPOINTS.ORGANIZATION.SETTLEMENT(data.organizationId), body)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("결산안 생성 실패 status:", error.response?.status);
        console.log(
          "결산안 생성 실패 detail:",
          JSON.stringify(error.response?.data, null, 2),
        );
        console.table(error.response?.data?.detail);
        throw error;
      });
  };

  // 조직 초대 목록 조회
  const getInvitations = (
    organizationId: string,
  ): Promise<OrganizationInvitation[]> => {
    return organizationApi
      .get(ENDPOINTS.ORGANIZATION.INVITATION(organizationId))
      .then((response) => response.data)
      .catch((error) => {
        console.log("조직 초대 목록 조회 실패 status:", error.response?.status);
        console.log("조직 초대 목록 조회 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 재정담당자/감사위원 초대 코드 발급
  const postInvitation = (
    data: PostInvitationData,
  ): Promise<OrganizationInvitation> => {
    return organizationApi
      .post(ENDPOINTS.ORGANIZATION.INVITATION(data.organizationId), {
        invitation_type: data.invitationType,
        invited_email: data.invitedEmail,
        role: data.role,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("조직 초대 발송 실패 status:", error.response?.status);
        console.log("조직 초대 발송 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 내 역할을 후임자에게 이전 (인수인계) — 호출자 본인의 역할을 넘긴다.
  const postRoleTransfer = (
    organizationId: string,
    successorEmail: string,
  ): Promise<OrganizationInvitation> => {
    return organizationApi
      .post(ENDPOINTS.ORGANIZATION.ROLE_TRANSFER(organizationId), {
        successor_email: successorEmail,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log("권한 이전 실패 status:", error.response?.status);
        console.log("권한 이전 실패 detail:", error.response?.data);
        throw error;
      });
  };

  // 조직 초대 회수
  const deleteInvitation = (
    organizationId: string,
    invitationId: string,
  ): Promise<void> => {
    return organizationApi
      .delete(ENDPOINTS.ORGANIZATION.INVITATION_DETAIL(organizationId, invitationId))
      .then(() => undefined)
      .catch((error) => {
        console.log("조직 초대 회수 실패 status:", error.response?.status);
        console.log("조직 초대 회수 실패 detail:", error.response?.data);
        throw error;
      });
  };

  return {
    postTemplate,
    patchTemplate,
    deleteTemplate,
    getTemplate,
    postSettlement,
    getOrganization,
    getInvitations,
    postInvitation,
    postRoleTransfer,
    deleteInvitation,
  };
};

export default useOrganizationApi;
