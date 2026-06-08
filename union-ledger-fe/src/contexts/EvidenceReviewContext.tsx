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
  status: string;
  extractedPayload: Record<string, unknown>;
  isExtracting: boolean;
}

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
  const [reviewItems, setReviewItems] = useState<EvidenceReviewItem[]>([]);

  const removeReviewItem = useCallback((id: string) => {
    setReviewItems((prevItems) => {
      const targetItem = prevItems.find((item) => item.id === id);

      if (targetItem) {
        URL.revokeObjectURL(targetItem.previewUrl);
      }

      return prevItems.filter((item) => item.id !== id);
    });
  }, []);

  const clearReviewItems = useCallback(() => {
    setReviewItems((prevItems) => {
      prevItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
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
    [reviewItems, removeReviewItem, clearReviewItems],
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
