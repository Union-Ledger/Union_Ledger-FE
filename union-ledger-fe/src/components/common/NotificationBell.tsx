import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as styles from "./NotificationBell.css";
import useNotificationApi, {
  type NotificationItem,
} from "@/hooks/useNotificationApi";

const POLL_INTERVAL_MS = 60_000;

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
  const { getNotifications, markNotificationRead } = useNotificationApi();
  const [getNotificationsOnce] = useState(() => getNotifications);
  const [markNotificationReadOnce] = useState(() => markNotificationRead);

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

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
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.bellButton}
        onClick={handleToggle}
        aria-label="알림"
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
