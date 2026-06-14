/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

export interface PromptOptions extends ConfirmOptions {
  /** 입력칸 위 라벨 */
  inputLabel?: string;
  placeholder?: string;
  /** true면 공백 입력 시 확인 버튼 비활성 */
  required?: boolean;
  initialValue?: string;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;
type PromptFn = (options: PromptOptions) => Promise<string | null>;

interface ContextValue {
  confirm: ConfirmFn;
  prompt: PromptFn;
}

const ConfirmContext = createContext<ContextValue | null>(null);

interface PendingDialog {
  options: PromptOptions;
  withInput: boolean;
  // null=취소, string=확인(입력값; confirm 모드는 빈 문자열)
  resolve: (value: string | null) => void;
}

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<PendingDialog | null>(null);
  const [inputValue, setInputValue] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const openDialog = useCallback(
    (options: PromptOptions, withInput: boolean) =>
      new Promise<string | null>((resolve) => {
        restoreFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        setInputValue(withInput ? options.initialValue ?? "" : "");
        setPending({ options, withInput, resolve });
      }),
    [],
  );

  const confirm = useCallback<ConfirmFn>(
    (options) => openDialog(options, false).then((value) => value !== null),
    [openDialog],
  );

  const prompt = useCallback<PromptFn>(
    (options) => openDialog(options, true),
    [openDialog],
  );

  const close = useCallback(
    (value: string | null) => {
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

    if (pending.withInput) {
      inputRef.current?.focus();
    } else {
      cancelButtonRef.current?.focus();
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(null);
        return;
      }

      // 다이얼로그 밖으로 포커스가 빠져나가지 않도록 Tab 순환
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusables = dialog.querySelectorAll<HTMLElement>(
          "button, textarea, input",
        );
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

  const value = useMemo<ContextValue>(
    () => ({ confirm, prompt }),
    [confirm, prompt],
  );

  const confirmDisabled = Boolean(
    pending?.withInput &&
      pending.options.required &&
      inputValue.trim().length === 0,
  );

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {pending && (
        <div
          className={styles.overlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              close(null);
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
            {pending.withInput && (
              <>
                {pending.options.inputLabel && (
                  <label htmlFor="confirm-dialog-input" className={styles.inputLabel}>
                    {pending.options.inputLabel}
                  </label>
                )}
                <textarea
                  id="confirm-dialog-input"
                  ref={inputRef}
                  className={styles.textarea}
                  value={inputValue}
                  placeholder={pending.options.placeholder}
                  onChange={(event) => setInputValue(event.target.value)}
                />
              </>
            )}
            <div className={styles.buttonRow}>
              <button
                ref={cancelButtonRef}
                type="button"
                className={styles.cancelButton}
                onClick={() => close(null)}
              >
                {pending.options.cancelLabel ?? "취소"}
              </button>
              <button
                type="button"
                className={`${styles.confirmButton({
                  tone: pending.options.tone ?? "default",
                })}${confirmDisabled ? ` ${styles.confirmButtonDisabled}` : ""}`}
                disabled={confirmDisabled}
                onClick={() => close(pending.withInput ? inputValue : "")}
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

  return context.confirm;
};

/**
 * 사유 등 텍스트 입력을 받는 확인 다이얼로그.
 *
 * const prompt = usePrompt();
 * const reason = await prompt({ title: "반려 사유", required: true });
 * if (reason === null) return; // 취소
 */
export const usePrompt = (): PromptFn => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("usePrompt은 ConfirmProvider 안에서만 사용할 수 있습니다.");
  }

  return context.prompt;
};
