export const BASE_URL = import.meta.env.VITE_API_URL;

export const ENDPOINTS = {
  AUTH: {
    SEND_VERIFICATION_CODE: "/auth/send-verification-code",
    VERIFY_EMAIL: "/auth/verify-email",
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    ME: "/auth/me",
  },
  ORGANIZATION: {
    LIST: "",
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
    RECONCILIATION_RUN: (settlementId: string) =>
      `/${settlementId}/reconciliation:run`,
    BANK_STATEMENT: (settlementId: string) =>
      `/${settlementId}/bank-statements`,
    BANK_TRANSACTION: (settlementId: string) =>
      `/${settlementId}/bank-transactions`,
  },
  AUDIT: {
    SETTLEMENT: "/settlements",
    SETTLEMENT_DETAIL: (settlementId: string) => `/settlements/${settlementId}`,
    COMMENT: (commentId: string) => `/comments/${commentId}`,
  },
  DASHBOARD: {
    TREASURER: "/treasurer",
    AUDITOR: "/auditor",
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
    EVIDENCE: (evidenceId: string) => `/evidences/${evidenceId}`,
    EVIDENCE_EXTRACT: (evidenceId: string) =>
      `/evidences/${evidenceId}/extract`,
  },
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
export type EndpointValue =
  (typeof ENDPOINTS)[keyof typeof ENDPOINTS][keyof (typeof ENDPOINTS)[keyof typeof ENDPOINTS]];
