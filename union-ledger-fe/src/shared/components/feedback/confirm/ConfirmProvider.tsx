/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as styles from "./Confirm.css";

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  /** 기본 "확인" */
  confirmLabel?: string;
  /** 기본 "취소" */
  cancelLabel?: string;
  /** danger면 확인 버튼이 빨간색(파괴적 행동용). 기본 default */
  tone?: "default" | "danger";
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      restoreFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPending({ options, resolve });
    });
  }, []);

  const close = useCallback(
    (value: boolean) => {
      if (!pending) return;

      pending.resolve(value);
      setPending(null);
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    },
    [pending],
  );

  useEffect(() => {
    if (!pending) return;

    cancelButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(false);
        return;
      }

      // 다이얼로그 밖으로 포커스가 빠져나가지 않도록 Tab 순환
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusables = dialog.querySelectorAll<HTMLElement>("button");
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [pending, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <div
          className={styles.overlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              close(false);
            }
          }}
        >
          <div
            ref={dialogRef}
            className={styles.dialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby={pending.options.description ? "confirm-dialog-description" : undefined}
          >
            <h2 id="confirm-dialog-title" className={styles.title}>
              {pending.options.title}
            </h2>
            {pending.options.description && (
              <div id="confirm-dialog-description" className={styles.description}>
                {pending.options.description}
              </div>
            )}
            <div className={styles.buttonRow}>
              <button
                ref={cancelButtonRef}
                type="button"
                className={styles.cancelButton}
                onClick={() => close(false)}
              >
                {pending.options.cancelLabel ?? "취소"}
              </button>
              <button
                type="button"
                className={styles.confirmButton({ tone: pending.options.tone ?? "default" })}
                onClick={() => close(true)}
              >
                {pending.options.confirmLabel ?? "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

/**
 * window.confirm() 대체.
 *
 * const confirm = useConfirm();
 * if (await confirm({ title: "정말 반려하시겠습니까?", tone: "danger" })) { ... }
 */
export const useConfirm = (): ConfirmFn => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm은 ConfirmProvider 안에서만 사용할 수 있습니다.");
  }

  return context;
};
