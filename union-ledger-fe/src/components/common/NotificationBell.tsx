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
  isOperator: boolean,
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
      return isOperator ? null : ROUTES.STUDENT_SETTLEMENTS;
    default:
      return null;
  }
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

  // 주기 폴링으로 미읽음 뱃지를 최신 상태로 유지
  useEffect(() => {
    const timer = window.setInterval(refresh, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

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
    const route = getNotificationRoute(
      item.notification_type,
      me?.roles ?? [],
      Boolean(me?.is_operator),
    );
    if (route) {
      setIsOpen(false);
      navigate(route);
    }

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
