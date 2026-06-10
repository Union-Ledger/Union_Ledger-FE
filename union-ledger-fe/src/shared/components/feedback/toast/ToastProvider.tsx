/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as styles from "./Toast.css";

export type ToastVariant = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** 자동 닫힘 시간(ms). 기본 4000 */
  duration?: number;
  action?: ToastAction;
}

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  action?: ToastAction;
}

interface ToastApi {
  show: (message: string, variant?: ToastVariant, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION_MS = 4000;
const MAX_VISIBLE_TOASTS = 4;

const VARIANT_ICONS: Record<ToastVariant, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = "info", options?: ToastOptions) => {
      const id = nextIdRef.current;
      nextIdRef.current += 1;

      setToasts((prev) => [
        ...prev.slice(-(MAX_VISIBLE_TOASTS - 1)),
        { id, message, variant, action: options?.action },
      ]);
      window.setTimeout(() => dismiss(id), options?.duration ?? DEFAULT_DURATION_MS);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (message, options) => show(message, "success", options),
      error: (message, options) => show(message, "error", options),
      info: (message, options) => show(message, "info", options),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.viewport} aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={styles.toast({ variant: toast.variant })}
            role={toast.variant === "error" ? "alert" : "status"}
          >
            <span className={styles.icon({ variant: toast.variant })} aria-hidden="true">
              {VARIANT_ICONS[toast.variant]}
            </span>
            <span className={styles.message}>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => {
                  toast.action?.onClick();
                  dismiss(toast.id);
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              className={styles.closeButton}
              aria-label="알림 닫기"
              onClick={() => dismiss(toast.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastApi => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast는 ToastProvider 안에서만 사용할 수 있습니다.");
  }

  return context;
};
