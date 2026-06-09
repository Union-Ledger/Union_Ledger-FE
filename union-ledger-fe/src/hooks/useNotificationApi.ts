import { useCallback } from "react";
import useApi from "./useApi";
import { ENDPOINTS } from "../../config";

export type NotificationType =
  | "settlement_submitted"
  | "audit_approved"
  | "audit_rejected"
  | "settlement_resubmitted"
  | "settlement_published";

export interface NotificationItem {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationListResponse {
  total: number;
  unread: number;
  items: NotificationItem[];
}

interface GetNotificationsParams {
  onlyUnread?: boolean;
  limit?: number;
}

const useNotificationApi = () => {
  const { api } = useApi();

  // 내 알림 목록 (총건수 + 미읽음수)
  const getNotifications = useCallback(
    (params?: GetNotificationsParams): Promise<NotificationListResponse> => {
      return api
        .get(ENDPOINTS.NOTIFICATION.LIST, {
          params: {
            only_unread: params?.onlyUnread ?? false,
            limit: params?.limit ?? 50,
          },
        })
        .then((response) => response.data)
        .catch((error) => {
          console.log("알림 조회 실패 status:", error.response?.status);
          console.log("알림 조회 실패 detail:", error.response?.data);
          throw error;
        });
    },
    [api],
  );

  // 알림 읽음 처리
  const markNotificationRead = useCallback(
    (notificationId: string): Promise<NotificationItem> => {
      return api
        .post(ENDPOINTS.NOTIFICATION.READ(notificationId))
        .then((response) => response.data)
        .catch((error) => {
          console.log("알림 읽음 처리 실패 status:", error.response?.status);
          console.log("알림 읽음 처리 실패 detail:", error.response?.data);
          throw error;
        });
    },
    [api],
  );

  return { getNotifications, markNotificationRead };
};

export default useNotificationApi;
