/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export interface EvidenceReviewItem {
  id: string;
  fileName: string;
  previewUrl: string;
  evidenceDate: string;
  merchantName: string;
  amount: string;
  paymentMethod: string;
  budgetCategory: string;
  groupName: string;
  isRefund: boolean;
  status: string;
  evidenceType: string;
  extractedPayload: Record<string, unknown>;
  isExtracting: boolean;
  extractStatus?: "pending" | "running" | "done" | "failed";
}

const STORAGE_KEY = "evidenceReviewItems";

const readStoredReviewItems = () => {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (!storedValue) return [];

    const parsedValue = JSON.parse(storedValue) as EvidenceReviewItem[];
    return parsedValue.map((item) => ({
      ...item,
      isRefund: Boolean(item.isRefund),
      groupName: item.groupName ?? "",
      evidenceType: item.evidenceType ?? "",
      previewUrl: "",
      extractStatus: item.extractStatus
        ? item.extractStatus === "running"
          ? "pending"
          : item.extractStatus
        : item.isExtracting
          ? "pending"
          : "done",
      isExtracting:
        item.extractStatus === "done" || item.extractStatus === "failed"
          ? false
          : item.isExtracting,
    }));
  } catch (error) {
    console.warn("증빙 검수 목록 복원 실패", error);
    return [];
  }
};

const persistReviewItems = (items: EvidenceReviewItem[]) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      items.map((item) => ({
        ...item,
        previewUrl: item.previewUrl.startsWith("blob:") ? "" : item.previewUrl,
      })),
    ),
  );
};

interface EvidenceReviewContextValue {
  reviewItems: EvidenceReviewItem[];
  setReviewItems: Dispatch<SetStateAction<EvidenceReviewItem[]>>;
  removeReviewItem: (id: string) => void;
  clearReviewItems: () => void;
}

const EvidenceReviewContext = createContext<EvidenceReviewContextValue | null>(
  null,
);

export const EvidenceReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviewItems, setReviewItemsState] =
    useState<EvidenceReviewItem[]>(readStoredReviewItems);

  const setReviewItems: Dispatch<SetStateAction<EvidenceReviewItem[]>> =
    useCallback((action) => {
      setReviewItemsState((prevItems) => {
        const nextItems =
          typeof action === "function" ? action(prevItems) : action;
        persistReviewItems(nextItems);
        return nextItems;
      });
    }, []);

  const removeReviewItem = useCallback((id: string) => {
    setReviewItemsState((prevItems) => {
      const targetItem = prevItems.find((item) => item.id === id);

      if (targetItem?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(targetItem.previewUrl);
      }

      const nextItems = prevItems.filter((item) => item.id !== id);
      persistReviewItems(nextItems);
      return nextItems;
    });
  }, []);

  const clearReviewItems = useCallback(() => {
    setReviewItemsState((prevItems) => {
      prevItems.forEach((item) => {
        if (item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
      localStorage.removeItem(STORAGE_KEY);
      return [];
    });
  }, []);

  const value = useMemo(
    () => ({
      reviewItems,
      setReviewItems,
      removeReviewItem,
      clearReviewItems,
    }),
    [reviewItems, setReviewItems, removeReviewItem, clearReviewItems],
  );

  return (
    <EvidenceReviewContext.Provider value={value}>
      {children}
    </EvidenceReviewContext.Provider>
  );
};

export const useEvidenceReview = () => {
  const context = useContext(EvidenceReviewContext);

  if (!context) {
    throw new Error(
      "useEvidenceReview must be used within EvidenceReviewProvider",
    );
  }

  return context;
};
