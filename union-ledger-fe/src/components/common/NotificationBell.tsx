import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import { useAuth } from "@/contexts/AuthContext";
import * as styles from "./NotificationBell.css";
import useNotificationApi, {
  type NotificationItem,
  type NotificationType,
} from "@/hooks/useNotificationApi";

const POLL_INTERVAL_MS = 60_000;

// 알림 유형 → 받은 사람 역할 기준으로 이동할 화면
const getNotificationRoute = (
  type: NotificationType,
  roles: string[],
): string | null => {
  switch (type) {
    case "settlement_submitted":
    case "settlement_resubmitted":
      return roles.includes("auditor") ? ROUTES.AUDITOR_REVIEW : null;
    case "audit_approved":
      if (roles.includes("president")) return ROUTES.PRESIDENT_DASHBOARD;
      if (roles.includes("treasurer")) return ROUTES.TREASURER_DASHBOARD;
      return null;
    case "audit_rejected":
      if (roles.includes("treasurer") || roles.includes("president")) {
        return ROUTES.CREATE;
      }
      return null;
    case "settlement_published":
      return ROUTES.STUDENT_SETTLEMENTS;
    default:
      return null;
  }
};

// 유형별 라우트가 없을 때라도 막다른 길이 되지 않도록 역할 홈으로 보낸다
const getFallbackRoute = (roles: string[], isOperator: boolean): string => {
  if (isOperator) return ROUTES.ADMIN_APPLICATIONS;
  if (roles.includes("president")) return ROUTES.PRESIDENT_DASHBOARD;
  if (roles.includes("treasurer")) return ROUTES.TREASURER_DASHBOARD;
  if (roles.includes("auditor")) return ROUTES.AUDITOR_DASHBOARD;
  return ROUTES.STUDENT_DASHBOARD;
};

const formatTimestamp = (iso: string) => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NotificationBell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { me } = useAuth();
  const { getNotifications, markNotificationRead } = useNotificationApi();
  const [getNotificationsOnce] = useState(() => getNotifications);
  const [markNotificationReadOnce] = useState(() => markNotificationRead);

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 패널 밖 클릭 또는 ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const refresh = useCallback(() => {
    getNotificationsOnce({ limit: 50 })
      .then((data) => {
        setItems(data.items);
        setUnread(data.unread);
      })
      .catch(() => {
        // 알림 조회 실패가 레이아웃 전체를 막지 않도록 조용히 무시한다.
      });
  }, [getNotificationsOnce]);

  // 최초 진입 + 라우트 변경 시 갱신 (예: 결산안 제출 직후 이동하면 뱃지 반영)
  useEffect(() => {
    refresh();
  }, [refresh, location.pathname]);

  // 주기 폴링으로 미읽음 뱃지를 최신 상태로 유지 — 탭이 숨겨지면 폴링 중단(배터리·요청 절약)
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden) refresh();
    }, POLL_INTERVAL_MS);

    const handleVisibility = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refresh]);

  const handleMarkAllRead = async () => {
    const unreadItems = items.filter((item) => !item.read_at);
    if (unreadItems.length === 0) return;

    // 낙관적 업데이트 — 실패하면 다음 폴링/refresh에서 정정
    const readAt = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) => (item.read_at ? item : { ...item, read_at: readAt })),
    );
    setUnread(0);

    try {
      await Promise.all(
        unreadItems.map((item) => markNotificationReadOnce(item.id)),
      );
    } catch {
      refresh();
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        refresh();
      }
      return next;
    });
  };

  const handleItemClick = async (item: NotificationItem) => {
    // 관련 화면이 있으면 바로 이동하고 패널을 닫는다
    const route =
      getNotificationRoute(item.notification_type, me?.roles ?? []) ??
      getFallbackRoute(me?.roles ?? [], Boolean(me?.is_operator));
    setIsOpen(false);
    navigate(route);

    if (item.read_at) {
      return;
    }

    try {
      const updated = await markNotificationReadOnce(item.id);
      setItems((prev) =>
        prev.map((notification) =>
          notification.id === updated.id ? updated : notification,
        ),
      );
      setUnread((prev) => Math.max(prev - 1, 0));
    } catch {
      // 읽음 처리 실패는 무시 — 다음 폴링에서 정정된다.
    }
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.bellButton}
        onClick={handleToggle}
        aria-label="알림"
        aria-expanded={isOpen}
      >
        <span>🔔 알림</span>
        {unread > 0 && (
          <span className={styles.badge}>{unread > 99 ? "99+" : unread}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelHeaderTitle}>알림</span>
            {unread > 0 && (
              <button
                type="button"
                className={styles.markAllButton}
                onClick={handleMarkAllRead}
              >
                모두 읽음
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className={styles.empty}>새 알림이 없습니다.</div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.item} ${
                  item.read_at ? "" : styles.itemUnread
                }`}
                onClick={() => handleItemClick(item)}
              >
                <div className={styles.itemTitle}>
                  {!item.read_at && <span className={styles.unreadDot} />}
                  {item.title}
                </div>
                <div className={styles.itemBody}>{item.body}</div>
                <div className={styles.itemTime}>
                  {formatTimestamp(item.created_at)}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
