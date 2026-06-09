export const BASE_URL = import.meta.env.VITE_API_URL;

export const ENDPOINTS = {
  AUTH: {
    SEND_VERIFICATION_CODE: "/auth/send-verification-code",
    VERIFY_EMAIL: "/auth/verify-email",
    PASSWORD_FORGOT: "/auth/password/forgot",
    PASSWORD_RESET: "/auth/password/reset",
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    ME: "/auth/me",
  },
  INVITATION: {
    ME: "/invitations/me",
    ACCEPT: (invitationId: string) => `/invitations/${invitationId}/accept`,
  },
  NOTIFICATION: {
    LIST: "/notifications",
    READ: (notificationId: string) => `/notifications/${notificationId}/read`,
  },
  ADMIN_APPLICATION: {
    CREATE: "/admin-applications",
    LIST: "/admin-applications",
    DETAIL: (applicationId: string) => `/admin-applications/${applicationId}`,
    DOCUMENT: (applicationId: string, index: number) =>
      `/admin-applications/${applicationId}/documents/${index}`,
    APPROVE: (applicationId: string) =>
      `/admin-applications/${applicationId}/approve`,
    REJECT: (applicationId: string) =>
      `/admin-applications/${applicationId}/reject`,
  },
  ORGANIZATION: {
    LIST: "",
    INVITATION: (organizationId: string) => `/${organizationId}/invitations`,
    INVITATION_DETAIL: (organizationId: string, invitationId: string) =>
      `/${organizationId}/invitations/${invitationId}`,
    TEMPLATE: (organizationId: string) => `/${organizationId}/templates`,
    SETTLEMENT: (organizationId: string) => `/${organizationId}/settlements`,
  },
  SETTLEMENT: {
    BASE: (settlementId: string) => `/${settlementId}`,
    SUBMIT: (settlementId: string) => `/${settlementId}/submit`,
    RESUBMIT: (settlementId: string) => `/${settlementId}/resubmit`,
    APPROVE: (settlementId: string) => `/${settlementId}/audit/approve`,
    REJECT: (settlementId: string) => `/${settlementId}/audit/reject`,
    PUBLISH: (settlementId: string) => `/${settlementId}/publish`,
    COMMENT: (settlementId: string) => `/${settlementId}/comments`,
    EVIDENCE: (settlementId: string) => `/${settlementId}/evidences`,
    EXPENSE_SUMMARY: (settlementId: string) =>
      `/${settlementId}/expense-summary`,
    RECONCILIATION: (settlementId: string) =>
      `/${settlementId}/reconciliation`,
    RECONCILIATION_RUN: (settlementId: string) =>
      `/${settlementId}/reconciliation:run`,
    BANK_STATEMENT: (settlementId: string) =>
      `/${settlementId}/bank-statements`,
    BANK_TRANSACTION: (settlementId: string) =>
      `/${settlementId}/bank-transactions`,
    ARTIFACT_GENERATE: (settlementId: string) =>
      `/${settlementId}/artifacts:generate`,
    ARTIFACT_LIST: (settlementId: string) => `/${settlementId}/artifacts`,
  },
  AUDIT: {
    SETTLEMENT: "/settlements",
    SETTLEMENT_DETAIL: (settlementId: string) => `/settlements/${settlementId}`,
    COMMENT: (commentId: string) => `/comments/${commentId}`,
  },
  DASHBOARD: {
    TREASURER: "/treasurer",
    AUDITOR: "/auditor",
    STUDENT: "/student",
    PRESIDENT: "/president",
  },
  PUBLIC: {
    SETTLEMENTS: "/settlements",
    SETTLEMENT_DETAIL: (settlementId: string) => `/settlements/${settlementId}`,
    SETTLEMENT_ITEMS: (settlementId: string) =>
      `/settlements/${settlementId}/items`,
    SETTLEMENT_DOWNLOAD: (settlementId: string, artifactId: string) =>
      `/settlements/${settlementId}/downloads/${artifactId}`,
    EVIDENCE: (evidenceId: string) => `/evidences/${evidenceId}`,
    EVIDENCE_FILE: (evidenceId: string) => `/evidences/${evidenceId}/file`,
  },
  BASE: {
    TEMPLATE: (templateId: string) => `/templates/${templateId}`,
    OCR: "/ocr/preview",
    BANK_STATEMENT: (uploadId: string) => `/bank-statements/${uploadId}`,
    EVIDENCE: (evidenceId: string) => `/evidences/${evidenceId}`,
    EVIDENCE_EXTRACT: (evidenceId: string) =>
      `/evidences/${evidenceId}/extract`,
    EVIDENCE_FILE: (evidenceId: string) => `/evidences/${evidenceId}/file`,
    ARTIFACT_DOWNLOAD: (artifactId: string) =>
      `/artifacts/${artifactId}/download`,
    RECONCILIATION_RESULT: (matchId: string) => `/reconciliation/${matchId}`,
  },
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
export type EndpointValue =
  (typeof ENDPOINTS)[keyof typeof ENDPOINTS][keyof (typeof ENDPOINTS)[keyof typeof ENDPOINTS]];
