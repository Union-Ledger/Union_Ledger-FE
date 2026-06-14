import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UploadCard from "@/components/common/UploadCard";
import useOrganizationApi from "@/hooks/useOrginizationApi";
import useSettlementApi from "@/hooks/useSettlementApi";
import useCommonApi from "@/hooks/useCommonApi";
import useDashboardApi, {
  type TreasurerDashboardResponse,
} from "@/hooks/useDashboardApi";
import {
  useEvidenceReview,
  type EvidenceReviewItem,
} from "@/contexts/EvidenceReviewContext";
import { Spinner, useConfirm, useToast } from "@shared/components/feedback";
import { getApiErrorMessage } from "@/utils/apiError";
import * as styles from "@/pages/treasurer/upload/Upload.css";

// 증빙 종류는 추출 단계에서 AI가 자동 판별한다. 업로드 시엔 기본값을 보내고,
// 추출 후 감지된 종류를 카드 배지로 보여준다.
const DEFAULT_EVIDENCE_TYPE = "physical_receipt";

const EVIDENCE_TYPE_LABELS: Record<string, string> = {
  physical_receipt: "실물 영수증",
  bank_transfer_statement: "거래명세서",
  e_receipt: "전자영수증",
};

const reusableSettlementStatuses = new Set([
  "draft",
  "ready_for_review",
  "submitted",
  "under_audit",
  "auditing",
  "approved",
  "rejected",
  "resubmitted",
]);

let settlementPreparationPromise: Promise<string | null> | null = null;

interface EvidenceApiResponse {
  id: string;
  evidence_date?: string | null;
  merchant_name?: string | null;
  amount?: string | number | null;
  payment_method?: string | null;
  budget_category?: string | null;
  group_name?: string | null;
  is_refund?: boolean | null;
  status?: string | null;
  evidence_type?: string | null;
  extracted_payload?: Record<string, unknown> | null;
}

const isSettlementNotFoundError = (error: unknown) => {
  const apiError = error as {
    response?: { data?: { detail?: unknown } };
  };

  return apiError.response?.data?.detail === "결산안을 찾을 수 없습니다.";
};

const formatAmount = (amount: string | number | null | undefined) => {
  if (amount === null || amount === undefined || amount === "") return "";
  const numericAmount = Number(String(amount).replace(/[,+₩\s]/g, ""));

  if (!Number.isFinite(numericAmount)) return String(amount);

  return numericAmount.toLocaleString("ko-KR");
};

const parseAmount = (amount: string) => {
  const numericAmount = Number(amount.replace(/[,+₩\s]/g, ""));
  return Number.isFinite(numericAmount) ? numericAmount : 0;
};

const findReusableSettlementId = (
  dashboardData: TreasurerDashboardResponse | undefined,
) => {
  return dashboardData?.recent_settlements.find((settlement) =>
    reusableSettlementStatuses.has(settlement.status),
  )?.settlement_id;
};

// 현재 날짜로 학년도·학기 추정 (3~8월=1학기, 9~12월=2학기, 1~2월=전년도 2학기)
const getCurrentAcademicPeriod = (): {
  academicYear: number;
  semester: "1" | "2";
} => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month >= 3 && month <= 8) {
    return { academicYear: year, semester: "1" };
  }
  if (month >= 9) {
    return { academicYear: year, semester: "2" };
  }
  return { academicYear: year - 1, semester: "2" };
};

const Upload = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [settlementId, setSettlementId] = useState<string | null>(null);
  // 구분 — 이 배치의 영수증들이 속한 행사/용도 (예: 중간고사 간식행사).
  // 영수증만으로는 알 수 없는 정보라 업로드 시 사람이 한 번 입력한다.
  // (카테고리는 사용자 입력 없이 항상 AI가 배경에서 자동 분류한다.)
  const [groupName, setGroupName] = useState("");
  const [isPreparing, setIsPreparing] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState("");
  const { reviewItems, setReviewItems, removeReviewItem } = useEvidenceReview();
  const [editingItem, setEditingItem] = useState<EvidenceReviewItem | null>(
    null,
  );
  const [editForm, setEditForm] = useState({
    evidenceDate: "",
    merchantName: "",
    amount: "",
    paymentMethod: "card",
    budgetCategory: "",
    groupName: "",
    isRefund: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  // 편집 모달에서 새로고침 후 원본 미리보기를 서버에서 다시 불러오기 위한 상태
  const [modalPreviewUrl, setModalPreviewUrl] = useState<string | null>(null);
  const [modalPreviewType, setModalPreviewType] = useState("");
  const [isModalPreviewLoading, setIsModalPreviewLoading] = useState(false);
  const [deletingEvidenceIds, setDeletingEvidenceIds] = useState(
    () => new Set<string>(),
  );
  const extractingEvidenceIdsRef = useRef(new Set<string>());
  const cancelledEvidenceIdsRef = useRef(new Set<string>());
  const extractAbortControllersRef = useRef(
    new Map<string, AbortController>(),
  );
  const extractQueueRef = useRef<
    { evidenceId: string; fallbackBudgetCategory: string }[]
  >([]);
  const isExtractQueueRunningRef = useRef(false);

  const { getOrganization, getTemplate, postSettlement } = useOrganizationApi();
  const { postEvidence, getSettlement } = useSettlementApi();
  const { postEvidenceExtract, patchEvidence, deleteEvidence, downloadEvidenceFile } =
    useCommonApi();
  const { getTreasurerDashboard } = useDashboardApi();
  const [getOrganizationOnce] = useState(() => getOrganization);
  const [getTemplateOnce] = useState(() => getTemplate);
  const [postSettlementOnce] = useState(() => postSettlement);
  const [postEvidenceOnce] = useState(() => postEvidence);
  const [getSettlementOnce] = useState(() => getSettlement);
  const [postEvidenceExtractOnce] = useState(() => postEvidenceExtract);
  const [patchEvidenceOnce] = useState(() => patchEvidence);
  const [deleteEvidenceOnce] = useState(() => deleteEvidence);
  const [downloadEvidenceFileOnce] = useState(() => downloadEvidenceFile);
  const [getTreasurerDashboardOnce] = useState(() => getTreasurerDashboard);

  const createDraftSettlement = useCallback(async () => {
    if (!settlementPreparationPromise) {
      settlementPreparationPromise = (async () => {
        const dashboardData = await getTreasurerDashboardOnce(20);
        const reusableSettlementId = findReusableSettlementId(dashboardData);

        if (reusableSettlementId) {
          try {
            await getSettlementOnce(reusableSettlementId);
            localStorage.setItem(
              "currentSettlementId",
              reusableSettlementId,
            );
            return reusableSettlementId;
          } catch (error) {
            console.warn("대시보드의 결산안 ID가 유효하지 않습니다.", error);
          }
        }

        let organizationId = localStorage.getItem("organizationId");
        let templates =
          organizationId === null
            ? undefined
            : await getTemplateOnce(organizationId);

        if (!organizationId || !templates || templates.length === 0) {
          const organizations = await getOrganizationOnce();

          if (!organizations || organizations.length === 0) {
            toast.error("소속된 조직이 없습니다.");
            return null;
          }

          organizationId = organizations[0].id;
          localStorage.setItem("organizationId", organizationId);
          templates = await getTemplateOnce(organizationId);
        }

        if (!templates || templates.length === 0) {
          toast.error(
            "등록된 결산안 템플릿이 없습니다. 먼저 템플릿을 등록해주세요.",
          );
          return null;
        }

        const activeTemplate = templates.find(
          (template: { is_active: boolean }) => template.is_active,
        );

        const templateId = activeTemplate?.id ?? templates[0].id;

        const { academicYear, semester } = getCurrentAcademicPeriod();
        const settlement = await postSettlementOnce({
          organizationId,
          templateId,
          title: `${academicYear}년도 ${semester}학기 결산안`,
          academicYear,
          semester,
        });

        if (!settlement?.id) return null;

        localStorage.setItem("currentSettlementId", settlement.id);
        return settlement.id;
      })();
    }

    const currentPromise = settlementPreparationPromise;

    try {
      const preparedSettlementId = await currentPromise;

      if (preparedSettlementId) {
        setSettlementId(preparedSettlementId);
      }

      return preparedSettlementId;
    } finally {
      if (settlementPreparationPromise === currentPromise) {
        settlementPreparationPromise = null;
      }
    }
  }, [
    getOrganizationOnce,
    getSettlementOnce,
    getTemplateOnce,
    getTreasurerDashboardOnce,
    postSettlementOnce,
    toast,
  ]);

  useEffect(() => {
    const prepareSettlement = async () => {
      try {
        const savedSettlementId = localStorage.getItem("currentSettlementId");

        if (savedSettlementId) {
          try {
            await getSettlementOnce(savedSettlementId);
            setSettlementId(savedSettlementId);
            return;
          } catch (error) {
            console.warn(
              "저장된 결산안 ID가 유효하지 않아 새로 생성합니다.",
              error,
            );
            localStorage.removeItem("currentSettlementId");
          }
        }

        await createDraftSettlement();
      } catch (error) {
        console.error("결산안 생성 준비 실패", error);
      } finally {
        setIsPreparing(false);
      }
    };

    prepareSettlement();
  }, [createDraftSettlement, getSettlementOnce]);

  // 이미 입력한 구분들 — 다음 배치 입력 시 자동완성으로 제안한다.
  const groupNameSuggestions = useMemo(() => {
    const names = reviewItems
      .map((item) => item.groupName.trim())
      .filter((name) => name.length > 0);
    return Array.from(new Set(names));
  }, [reviewItems]);

  const createReviewItem = (
    evidence: EvidenceApiResponse,
    file: File,
    defaultBudgetCategory: string,
    defaultGroupName: string,
  ): EvidenceReviewItem => ({
    id: evidence.id,
    fileName: file.name,
    previewUrl: URL.createObjectURL(file),
    evidenceDate: evidence.evidence_date ?? "",
    merchantName: evidence.merchant_name ?? "",
    amount: formatAmount(evidence.amount),
    paymentMethod: evidence.payment_method ?? "card",
    budgetCategory: evidence.budget_category ?? defaultBudgetCategory,
    groupName: evidence.group_name ?? defaultGroupName,
    isRefund: evidence.is_refund ?? false,
    status: evidence.status ?? "uploaded",
    evidenceType: evidence.evidence_type ?? "",
    extractedPayload: evidence.extracted_payload ?? {},
    isExtracting: false,
    extractStatus: "pending",
  });

  const applyExtractedEvidence = useCallback(
    (evidence: EvidenceApiResponse) => {
      setReviewItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id !== evidence.id) return item;

          return {
            ...item,
            evidenceDate: evidence.evidence_date ?? item.evidenceDate,
            merchantName: evidence.merchant_name ?? item.merchantName,
            amount:
              evidence.amount === undefined || evidence.amount === null
                ? item.amount
                : formatAmount(evidence.amount),
            paymentMethod: evidence.payment_method ?? item.paymentMethod,
            budgetCategory: evidence.budget_category ?? item.budgetCategory,
            groupName: evidence.group_name ?? item.groupName,
            isRefund: evidence.is_refund ?? item.isRefund,
            status: evidence.status ?? item.status,
            evidenceType: evidence.evidence_type ?? item.evidenceType,
            extractedPayload:
              evidence.extracted_payload ?? item.extractedPayload,
            isExtracting: false,
            extractStatus: "done",
          };
        }),
      );
    },
    [setReviewItems],
  );

  const processExtractQueue = useCallback(async () => {
    if (isExtractQueueRunningRef.current) return;

    isExtractQueueRunningRef.current = true;

    while (extractQueueRef.current.length > 0) {
      const queueItem = extractQueueRef.current.shift();

      if (!queueItem) continue;

      const { evidenceId, fallbackBudgetCategory } = queueItem;
      if (cancelledEvidenceIdsRef.current.has(evidenceId)) {
        extractingEvidenceIdsRef.current.delete(evidenceId);
        continue;
      }

      const abortController = new AbortController();
      extractAbortControllersRef.current.set(evidenceId, abortController);

      try {
        const extractedEvidence = await postEvidenceExtractOnce(
          evidenceId,
          abortController.signal,
        );

        if (cancelledEvidenceIdsRef.current.has(evidenceId)) continue;

        applyExtractedEvidence({
          ...extractedEvidence,
          id: evidenceId,
          budget_category:
            extractedEvidence?.budget_category ?? fallbackBudgetCategory,
        });
      } catch (error) {
        if (
          abortController.signal.aborted ||
          cancelledEvidenceIdsRef.current.has(evidenceId)
        ) {
          continue;
        }

        console.error("OCR/PDF 추출 실패", error);
        setReviewItems((prevItems) =>
          prevItems.map((item) =>
            item.id === evidenceId
              ? { ...item, isExtracting: false, extractStatus: "failed" }
              : item,
          ),
        );
        setUploadStatusMessage(
          "증빙 업로드는 완료됐지만 일부 OCR/PDF 추출에 실패했습니다.",
        );
      } finally {
        extractAbortControllersRef.current.delete(evidenceId);
        extractingEvidenceIdsRef.current.delete(evidenceId);
      }
    }

    isExtractQueueRunningRef.current = false;
  }, [applyExtractedEvidence, postEvidenceExtractOnce, setReviewItems]);

  const enqueueEvidenceExtract = useCallback(
    (evidenceId: string, fallbackBudgetCategory: string) => {
      if (extractingEvidenceIdsRef.current.has(evidenceId)) return;

      extractingEvidenceIdsRef.current.add(evidenceId);
      setReviewItems((prevItems) =>
        prevItems.map((item) =>
          item.id === evidenceId
            ? { ...item, isExtracting: true, extractStatus: "running" }
            : item,
        ),
      );
      extractQueueRef.current.push({ evidenceId, fallbackBudgetCategory });
      void processExtractQueue();
    },
    [processExtractQueue, setReviewItems],
  );

  // 업로드 즉시 자동 실행하지 않고, 사용자가 실행 버튼을 눌렀을 때만 OCR을 돌린다.
  const runPendingExtracts = useCallback(() => {
    reviewItems.forEach((item) => {
      if (item.extractStatus === "pending") {
        enqueueEvidenceExtract(item.id, item.budgetCategory);
      }
    });
  }, [reviewItems, enqueueEvidenceExtract]);

  const handleDeleteEvidence = async (item: EvidenceReviewItem) => {
    if (deletingEvidenceIds.has(item.id)) return;

    const ok = await confirm({
      title: "증빙 자료를 삭제할까요?",
      description: `${item.fileName} 파일이 결산안에서 제거됩니다.`,
      confirmLabel: "삭제",
      tone: "danger",
    });
    if (!ok) return;

    const shouldRestartExtraction =
      item.extractStatus === "pending" || item.extractStatus === "running";

    setDeletingEvidenceIds((prevIds) => {
      const nextIds = new Set(prevIds);
      nextIds.add(item.id);
      return nextIds;
    });

    cancelledEvidenceIdsRef.current.add(item.id);
    extractQueueRef.current = extractQueueRef.current.filter(
      (queueItem) => queueItem.evidenceId !== item.id,
    );
    extractAbortControllersRef.current.get(item.id)?.abort();
    extractingEvidenceIdsRef.current.delete(item.id);

    try {
      await deleteEvidenceOnce(item.id);

      if (editingItem?.id === item.id) {
        setEditingItem(null);
      }

      removeReviewItem(item.id);
      toast.success("증빙 자료가 삭제되었습니다.");
    } catch (error) {
      console.error("증빙 삭제 실패", error);
      cancelledEvidenceIdsRef.current.delete(item.id);

      if (shouldRestartExtraction) {
        setReviewItems((prevItems) =>
          prevItems.map((reviewItem) =>
            reviewItem.id === item.id
              ? {
                  ...reviewItem,
                  isExtracting: true,
                  extractStatus: "pending",
                }
              : reviewItem,
          ),
        );
      }

      toast.error("증빙 자료 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setDeletingEvidenceIds((prevIds) => {
        const nextIds = new Set(prevIds);
        nextIds.delete(item.id);
        return nextIds;
      });
    }
  };

  // modalPreviewUrl 이 바뀌거나 모달이 닫히면 이전 object URL 을 해제한다.
  useEffect(() => {
    return () => {
      if (modalPreviewUrl) {
        URL.revokeObjectURL(modalPreviewUrl);
      }
    };
  }, [modalPreviewUrl]);

  const openEditModal = (item: EvidenceReviewItem) => {
    setEditingItem(item);
    setEditForm({
      evidenceDate: item.evidenceDate,
      merchantName: item.merchantName,
      amount: item.amount,
      paymentMethod: item.paymentMethod,
      budgetCategory: item.budgetCategory,
      groupName: item.groupName,
      isRefund: item.isRefund,
    });

    // 새로고침 후엔 blob previewUrl 이 사라지므로 서버에서 원본을 다시 불러온다.
    setModalPreviewUrl(null);
    setModalPreviewType("");
    if (!item.previewUrl) {
      setIsModalPreviewLoading(true);
      downloadEvidenceFileOnce(item.id)
        .then((blob) => {
          setModalPreviewUrl(URL.createObjectURL(blob));
          setModalPreviewType(blob.type);
        })
        .catch((error) => {
          console.error("증빙 원본 재조회 실패", error);
        })
        .finally(() => setIsModalPreviewLoading(false));
    }
  };

  const closeEditModal = useCallback(async () => {
    if (isSaving) return;

    // 입력했지만 저장하지 않은 변경이 있으면 닫기 전에 확인
    const isDirty =
      editingItem !== null &&
      (editForm.evidenceDate !== editingItem.evidenceDate ||
        editForm.merchantName !== editingItem.merchantName ||
        editForm.amount !== editingItem.amount ||
        editForm.paymentMethod !== editingItem.paymentMethod ||
        editForm.groupName !== editingItem.groupName ||
        editForm.isRefund !== editingItem.isRefund);

    if (isDirty) {
      const ok = await confirm({
        title: "수정 중인 내용이 있습니다",
        description: "저장하지 않고 닫으면 변경한 내용이 사라집니다.",
        confirmLabel: "저장 안 함",
        cancelLabel: "계속 수정",
      });
      if (!ok) return;
    }

    setEditingItem(null);
    setModalPreviewUrl(null);
    setModalPreviewType("");
    setIsModalPreviewLoading(false);
  }, [confirm, editForm, editingItem, isSaving]);

  // 편집 모달 ESC 닫기 (확인 다이얼로그가 떠 있으면 그쪽 ESC가 우선)
  useEffect(() => {
    if (!editingItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (document.querySelector('[role="alertdialog"]')) return;
      void closeEditModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editingItem, closeEditModal]);

  const handleSaveEvidence = async () => {
    if (!editingItem) return;

    if (!editForm.evidenceDate || !editForm.merchantName || !editForm.amount) {
      toast.error("날짜, 상호명, 금액을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      await patchEvidenceOnce({
        evidenceId: editingItem.id,
        evidenceDate: editForm.evidenceDate,
        merchantName: editForm.merchantName,
        amount: parseAmount(editForm.amount),
        paymentMethod: editForm.paymentMethod,
        budgetCategory: editForm.budgetCategory.trim(),
        groupName: editForm.groupName.trim(),
        isRefund: editForm.isRefund,
        status: editingItem.status,
        extractedPayload: editingItem.extractedPayload,
      });

      removeReviewItem(editingItem.id);
      setEditingItem(null);
      toast.success("증빙 정보가 저장되었습니다.");
    } catch (error) {
      console.error("증빙 수정 저장 실패", error);
      toast.error("증빙 수정 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!settlementId) {
      toast.error("결산안 생성이 완료된 후 다시 업로드해주세요.");
      return;
    }

    // 카테고리는 항상 비워서 보낸다 — 서버(Gemini)가 영수증별로 자동 분류한다.
    const trimmedBudgetCategory = "";
    // 구분은 이 배치 전체에 일괄 적용된다 (행사 단위 업로드 전제).
    const trimmedGroupName = groupName.trim();

    const fileList = Array.from(files);
    const uploadFiles = (targetSettlementId: string) =>
      Promise.all(
        fileList.map((file) =>
          postEvidenceOnce({
            settlementId: targetSettlementId,
            evidenceType: DEFAULT_EVIDENCE_TYPE,
            budgetCategory: trimmedBudgetCategory,
            groupName: trimmedGroupName,
            file,
          }),
        ),
      );

    try {
      setIsUploading(true);

      let uploadResults;

      try {
        uploadResults = await uploadFiles(settlementId);
      } catch (error) {
        if (!isSettlementNotFoundError(error)) throw error;

        console.warn("결산안이 없어 새 결산안 생성 후 업로드를 재시도합니다.");
        localStorage.removeItem("currentSettlementId");
        const nextSettlementId = await createDraftSettlement();

        if (!nextSettlementId) throw error;

        uploadResults = await uploadFiles(nextSettlementId);
      }

      console.log("증빙 업로드 성공", uploadResults);

      const uploadedEvidences = uploadResults.filter(
        (result) => result && result.id,
      ) as EvidenceApiResponse[];

      if (uploadedEvidences.length === 0) {
        toast.error("업로드된 증빙이 없습니다.");
        return;
      }

      const nextReviewItems = uploadedEvidences.map((evidence, index) =>
        createReviewItem(
          evidence,
          fileList[index],
          trimmedBudgetCategory,
          trimmedGroupName,
        ),
      );

      setReviewItems((prevItems) => [...nextReviewItems, ...prevItems]);
      toast.success(`증빙 ${uploadedEvidences.length}건이 업로드되었습니다.`);
      setUploadStatusMessage(
        "증빙 업로드가 완료되었습니다. 'OCR 실행' 버튼을 누르면 종류와 금액을 자동으로 인식합니다.",
      );

    } catch (error) {
      console.error("증빙 업로드 실패", error);
      setUploadStatusMessage("");
      toast.error(
        getApiErrorMessage(
          error,
          "증빙 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.",
        ),
      );
    } finally {
      setIsUploading(false);
    }
  };

  // OCR 큐 진행 현황 — 업로드 목록 헤더에 표시
  const extractSummary = useMemo(() => {
    const running = reviewItems.filter(
      (item) => item.extractStatus === "running",
    ).length;
    const pending = reviewItems.filter(
      (item) => item.extractStatus === "pending",
    ).length;
    const failed = reviewItems.filter(
      (item) => item.extractStatus === "failed",
    ).length;
    const done = reviewItems.filter(
      (item) => item.extractStatus === "done",
    ).length;

    return { running, pending, failed, done };
  }, [reviewItems]);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>증빙 업로드</span>
        <span className={styles.desc}>
          영수증을 올리면 종류·금액을 자동으로 인식합니다
        </span>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.categoryFieldContainer}>
          <label className={styles.categoryLabel} htmlFor="group-name">
            구분 — 행사/용도
          </label>
          <input
            id="group-name"
            className={styles.categoryInput}
            list="group-name-suggestions"
            placeholder="예: 중간고사 간식행사"
            value={groupName}
            disabled={isPreparing || isUploading}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <datalist id="group-name-suggestions">
            {groupNameSuggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div className={styles.cardContainer}>
          <UploadCard
            iconBackground="purple"
            title={
              isPreparing
                ? "결산안 준비 중..."
                : isUploading
                  ? "업로드 중..."
                  : "파일 선택 (여러 개 가능)"
            }
            desc="JPG, PNG, PDF"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            disabled={isPreparing || isUploading}
            onChangeFile={handleChangeFile}
          />
        </div>

        {uploadStatusMessage && (
          <div className={styles.statusMessage}>{uploadStatusMessage}</div>
        )}
      </div>

      {reviewItems.length > 0 && (
        <section className={styles.reviewSection}>
          <div className={styles.reviewTitleRow}>
            <h2 className={styles.reviewTitle}>
              업로드 목록 ({reviewItems.length})
            </h2>
            {extractSummary.pending > 0 && (
              <button
                type="button"
                className={styles.runExtractButton}
                onClick={runPendingExtracts}
                disabled={extractSummary.running > 0}
              >
                OCR 실행 ({extractSummary.pending}건)
              </button>
            )}
            {extractSummary.running > 0 && (
              <span className={styles.extractProgress}>
                <Spinner size="sm" label="OCR 진행 중" />
                OCR 처리 중 {extractSummary.done}/{reviewItems.length}
              </span>
            )}
            {extractSummary.running === 0 && extractSummary.failed > 0 && (
              <span className={styles.extractFailedSummary}>
                OCR 실패 {extractSummary.failed}건 — 카드에서 다시 시도할 수
                있습니다
              </span>
            )}
          </div>

          <div className={styles.reviewGrid}>
            {reviewItems.map((item) => (
              <article key={item.id} className={styles.reviewCard}>
                <button
                  type="button"
                  className={styles.reviewDeleteButton}
                  aria-label={`${item.fileName} 삭제`}
                  title="증빙 자료 삭제"
                  disabled={deletingEvidenceIds.has(item.id)}
                  onClick={() => void handleDeleteEvidence(item)}
                >
                  ×
                </button>

                {!item.previewUrl ? (
                  <div className={styles.pdfPreview}>{item.fileName}</div>
                ) : item.fileName.toLowerCase().endsWith(".pdf") ? (
                  <div className={styles.pdfPreview}>PDF</div>
                ) : (
                  <img
                    className={styles.reviewImage}
                    src={item.previewUrl}
                    alt={item.fileName}
                  />
                )}

                <div className={styles.reviewCardBody}>
                  {item.evidenceType &&
                    EVIDENCE_TYPE_LABELS[item.evidenceType] && (
                      <span className={styles.evidenceTypeBadge}>
                        {EVIDENCE_TYPE_LABELS[item.evidenceType]}
                      </span>
                    )}
                  <span className={styles.reviewDate}>
                    {item.evidenceDate || "날짜 확인 필요"}
                  </span>
                  <strong className={styles.reviewMerchant}>
                    {item.merchantName || "상호명 확인 필요"}
                  </strong>
                  <span className={styles.reviewAmount}>
                    {item.amount ? `₩${item.amount}` : "금액 확인 필요"}
                  </span>
                  <span className={styles.reviewCategory}>
                    {item.groupName ? `구분: ${item.groupName}` : "구분 미입력"}
                  </span>
                  {item.isRefund && (
                    <span className={styles.refundBadge}>
                      환불/취소 (총액에서 차감)
                    </span>
                  )}

                  <button
                    type="button"
                    className={styles.reviewButton}
                    onClick={() => openEditModal(item)}
                  >
                    수정
                  </button>
                  {item.extractStatus === "running" && (
                    <span className={styles.reviewExtractStatus}>
                      <Spinner size="sm" label="OCR 처리 중" />
                      OCR 처리 중입니다. 직접 수정할 수도 있습니다.
                    </span>
                  )}
                  {item.extractStatus === "pending" && (
                    <button
                      type="button"
                      className={styles.cardRunExtractButton}
                      onClick={() =>
                        enqueueEvidenceExtract(item.id, item.budgetCategory)
                      }
                    >
                      OCR 실행
                    </button>
                  )}
                  {item.extractStatus === "failed" && (
                    <span className={styles.reviewExtractStatus}>
                      OCR 실패. 직접 수정하거나
                      <button
                        type="button"
                        className={styles.retryExtractButton}
                        onClick={() =>
                          enqueueEvidenceExtract(item.id, item.budgetCategory)
                        }
                      >
                        다시 시도
                      </button>
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {editingItem && (
        <div className={styles.modalOverlay} role="presentation">
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>증빙 확인 및 수정</h2>
              <button
                type="button"
                className={styles.modalCloseButton}
                onClick={() => void closeEditModal()}
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.originalColumn}>
                <h3 className={styles.modalSectionTitle}>원본</h3>
                {editingItem.previewUrl ? (
                  editingItem.fileName.toLowerCase().endsWith(".pdf") ? (
                    <div className={styles.modalPdfPreview}>PDF 증빙 파일</div>
                  ) : (
                    <img
                      className={styles.modalImage}
                      src={editingItem.previewUrl}
                      alt={editingItem.fileName}
                    />
                  )
                ) : isModalPreviewLoading ? (
                  <div className={styles.modalPdfPreview}>
                    원본을 불러오는 중...
                  </div>
                ) : modalPreviewUrl ? (
                  modalPreviewType.startsWith("image/") ? (
                    <img
                      className={styles.modalImage}
                      src={modalPreviewUrl}
                      alt={editingItem.fileName}
                    />
                  ) : (
                    <div className={styles.modalPdfPreview}>
                      PDF 증빙 파일
                      <br />
                      <button
                        type="button"
                        onClick={() => window.open(modalPreviewUrl, "_blank")}
                        style={{
                          marginTop: 8,
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "none",
                          background: "#7c3aed",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        새 탭에서 원본 열기
                      </button>
                    </div>
                  )
                ) : (
                  <div className={styles.modalPdfPreview}>
                    {editingItem.fileName}
                    <br />
                    원본을 불러오지 못했습니다.
                  </div>
                )}
              </div>

              <div className={styles.formColumn}>
                <label className={styles.formLabel} htmlFor="evidence-date">
                  날짜
                </label>
                <input
                  id="evidence-date"
                  className={styles.formInput}
                  type="date"
                  value={editForm.evidenceDate}
                  onChange={(event) =>
                    setEditForm((prevForm) => ({
                      ...prevForm,
                      evidenceDate: event.target.value,
                    }))
                  }
                />

                <label className={styles.formLabel} htmlFor="merchant-name">
                  상호명
                </label>
                <input
                  id="merchant-name"
                  className={styles.formInput}
                  value={editForm.merchantName}
                  onChange={(event) =>
                    setEditForm((prevForm) => ({
                      ...prevForm,
                      merchantName: event.target.value,
                    }))
                  }
                />

                <label className={styles.formLabel} htmlFor="evidence-amount">
                  금액
                </label>
                <input
                  id="evidence-amount"
                  className={styles.formInput}
                  inputMode="numeric"
                  placeholder="예: 50,000"
                  value={editForm.amount}
                  onChange={(event) => {
                    const numericOnly = event.target.value.replace(/[^0-9]/g, "");
                    setEditForm((prevForm) => ({
                      ...prevForm,
                      amount: numericOnly
                        ? Number(numericOnly).toLocaleString("ko-KR")
                        : "",
                    }));
                  }}
                />

                <label className={styles.formLabel} htmlFor="payment-method">
                  결제수단
                </label>
                <select
                  id="payment-method"
                  className={styles.formInput}
                  value={editForm.paymentMethod}
                  onChange={(event) =>
                    setEditForm((prevForm) => ({
                      ...prevForm,
                      paymentMethod: event.target.value,
                    }))
                  }
                >
                  <option value="card">카드</option>
                  <option value="cash">현금</option>
                  <option value="transfer">계좌이체</option>
                  <option value="other">기타</option>
                </select>

                <label className={styles.formLabel} htmlFor="group-name-edit">
                  구분 (행사/용도)
                </label>
                <input
                  id="group-name-edit"
                  className={styles.formInput}
                  list="group-name-suggestions"
                  placeholder="예: 중간고사 간식행사"
                  value={editForm.groupName}
                  onChange={(event) =>
                    setEditForm((prevForm) => ({
                      ...prevForm,
                      groupName: event.target.value,
                    }))
                  }
                />

                <label
                  htmlFor="is-refund-edit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <input
                    id="is-refund-edit"
                    type="checkbox"
                    checked={editForm.isRefund}
                    onChange={(event) =>
                      setEditForm((prevForm) => ({
                        ...prevForm,
                        isRefund: event.target.checked,
                      }))
                    }
                  />
                  <span>환불/취소 영수증</span>
                </label>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={handleSaveEvidence}
                    disabled={isSaving}
                  >
                    {isSaving ? "저장 중..." : "저장"}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => void closeEditModal()}
                    disabled={isSaving}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
