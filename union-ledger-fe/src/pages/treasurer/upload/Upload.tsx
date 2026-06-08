import { useCallback, useEffect, useState } from "react";
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
import * as styles from "@/pages/treasurer/upload/Upload.css";

type ReceiptType = "offlineReceipt" | "statement" | "onlineReceipt";

const receiptTypeOptions: {
  id: ReceiptType;
  title: string;
  desc: string;
}[] = [
  {
    id: "offlineReceipt",
    title: "실물 영수증",
    desc: "카드결제, POS 영수증",
  },
  {
    id: "statement",
    title: "거래명세서",
    desc: "계좌이체 은행문서",
  },
  {
    id: "onlineReceipt",
    title: "전자영수증",
    desc: "온라인 결제",
  },
];

const evidenceTypeMap: Record<ReceiptType, string> = {
  offlineReceipt: "physical_receipt",
  statement: "bank_statement",
  onlineReceipt: "electronic_receipt",
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
  status?: string | null;
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

const Upload = () => {
  const [selectedType, setSelectedType] =
    useState<ReceiptType>("offlineReceipt");
  const [settlementId, setSettlementId] = useState<string | null>(null);
  const [budgetCategory, setBudgetCategory] = useState("");
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
  });
  const [isSaving, setIsSaving] = useState(false);

  const { getOrganization, getTemplate, postSettlement } = useOrganizationApi();
  const { postEvidence, getSettlement } = useSettlementApi();
  const { postEvidenceExtract, patchEvidence } = useCommonApi();
  const { getTreasurerDashboard } = useDashboardApi();
  const [getOrganizationOnce] = useState(() => getOrganization);
  const [getTemplateOnce] = useState(() => getTemplate);
  const [postSettlementOnce] = useState(() => postSettlement);
  const [postEvidenceOnce] = useState(() => postEvidence);
  const [getSettlementOnce] = useState(() => getSettlement);
  const [postEvidenceExtractOnce] = useState(() => postEvidenceExtract);
  const [patchEvidenceOnce] = useState(() => patchEvidence);
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
            alert("소속된 조직이 없습니다.");
            return null;
          }

          organizationId = organizations[0].id;
          localStorage.setItem("organizationId", organizationId);
          templates = await getTemplateOnce(organizationId);
        }

        if (!templates || templates.length === 0) {
          alert(
            "등록된 결산안 템플릿이 없습니다. 먼저 템플릿을 등록해주세요.",
          );
          return null;
        }

        const activeTemplate = templates.find(
          (template: { is_active: boolean }) => template.is_active,
        );

        const templateId = activeTemplate?.id ?? templates[0].id;

        const settlement = await postSettlementOnce({
          organizationId,
          templateId,
          title: "2024년도 2학기 결산안",
          academicYear: 2024,
          semester: "2",
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

  const createReviewItem = (
    evidence: EvidenceApiResponse,
    file: File,
    defaultBudgetCategory: string,
  ): EvidenceReviewItem => ({
    id: evidence.id,
    fileName: file.name,
    previewUrl: URL.createObjectURL(file),
    evidenceDate: evidence.evidence_date ?? "",
    merchantName: evidence.merchant_name ?? "",
    amount: formatAmount(evidence.amount),
    paymentMethod: evidence.payment_method ?? "card",
    budgetCategory: evidence.budget_category ?? defaultBudgetCategory,
    status: evidence.status ?? "uploaded",
    extractedPayload: evidence.extracted_payload ?? {},
    isExtracting: true,
  });

  const applyExtractedEvidence = (evidence: EvidenceApiResponse) => {
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
          status: evidence.status ?? item.status,
          extractedPayload: evidence.extracted_payload ?? item.extractedPayload,
          isExtracting: false,
        };
      }),
    );
  };

  const openEditModal = (item: EvidenceReviewItem) => {
    setEditingItem(item);
    setEditForm({
      evidenceDate: item.evidenceDate,
      merchantName: item.merchantName,
      amount: item.amount,
      paymentMethod: item.paymentMethod,
      budgetCategory: item.budgetCategory,
    });
  };

  const closeEditModal = () => {
    if (isSaving) return;
    setEditingItem(null);
  };

  const handleSaveEvidence = async () => {
    if (!editingItem) return;

    if (!editForm.evidenceDate || !editForm.merchantName || !editForm.amount) {
      alert("날짜, 상호명, 금액을 모두 입력해주세요.");
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
        status: editingItem.status,
        extractedPayload: editingItem.extractedPayload,
      });

      removeReviewItem(editingItem.id);
      setEditingItem(null);
    } catch (error) {
      console.error("증빙 수정 저장 실패", error);
      alert("증빙 수정 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!settlementId) {
      alert("결산안 생성이 완료된 후 다시 업로드해주세요.");
      return;
    }

    const trimmedBudgetCategory = budgetCategory.trim();

    if (!trimmedBudgetCategory) {
      alert("카테고리를 입력한 후 업로드해주세요.");
      return;
    }

    const fileList = Array.from(files);
    const uploadFiles = (targetSettlementId: string) =>
      Promise.all(
        fileList.map((file) =>
          postEvidenceOnce({
            settlementId: targetSettlementId,
            evidenceType: evidenceTypeMap[selectedType],
            budgetCategory: trimmedBudgetCategory,
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
        alert("업로드된 증빙이 없습니다.");
        return;
      }

      const nextReviewItems = uploadedEvidences.map((evidence, index) =>
        createReviewItem(evidence, fileList[index], trimmedBudgetCategory),
      );

      setReviewItems((prevItems) => [...nextReviewItems, ...prevItems]);
      setUploadStatusMessage(
        "증빙 업로드가 완료되었습니다. OCR/PDF 추출은 백그라운드에서 진행 중입니다.",
      );

      void Promise.allSettled(
        uploadedEvidences.map(async (evidence) => {
          const extractedEvidence = await postEvidenceExtractOnce(evidence.id);
          applyExtractedEvidence({
            ...extractedEvidence,
            id: evidence.id,
            budget_category:
              extractedEvidence?.budget_category ?? trimmedBudgetCategory,
          });
        }),
      ).then((extractResults) => {
        const failedExtracts = extractResults.filter(
          (result) => result.status === "rejected",
        );

        if (failedExtracts.length > 0) {
          console.error("OCR/PDF 추출 실패 목록", failedExtracts);
          setReviewItems((prevItems) =>
            prevItems.map((item) =>
              uploadedEvidences.some((evidence) => evidence.id === item.id)
                ? { ...item, isExtracting: false }
                : item,
            ),
          );
          setUploadStatusMessage(
            "증빙 업로드는 완료됐지만 일부 OCR/PDF 추출에 실패했습니다.",
          );
          return;
        }

        setUploadStatusMessage("OCR/PDF 추출까지 완료되었습니다.");
        console.log("OCR/PDF 추출 요청 완료");
      });
    } catch (error) {
      console.error("증빙 업로드 실패", error);
      setUploadStatusMessage("");
      alert("증빙 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>증빙 업로드</span>
        <span className={styles.desc}>증빙 유형 선택 후 파일 업로드</span>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.typeSelectorContainer}>
          {receiptTypeOptions.map((item) => {
            const isSelected = selectedType === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.typeCard} ${
                  isSelected ? styles.typeCardSelected : styles.typeCardDefault
                }`}
                onClick={() => setSelectedType(item.id)}
                disabled={isPreparing || isUploading}
              >
                <span className={styles.typeCardTitle}>{item.title}</span>
                <span className={styles.typeCardDesc}>{item.desc}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.categoryFieldContainer}>
          <label className={styles.categoryLabel} htmlFor="budget-category">
            카테고리
          </label>
          <input
            id="budget-category"
            className={styles.categoryInput}
            value={budgetCategory}
            placeholder="예: 행사비, 사무용품비"
            disabled={isPreparing || isUploading}
            onChange={(e) => setBudgetCategory(e.target.value)}
          />
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
          <h2 className={styles.reviewTitle}>
            업로드 목록 ({reviewItems.length})
          </h2>

          <div className={styles.reviewGrid}>
            {reviewItems.map((item) => (
              <article key={item.id} className={styles.reviewCard}>
                {item.fileName.toLowerCase().endsWith(".pdf") ? (
                  <div className={styles.pdfPreview}>PDF</div>
                ) : (
                  <img
                    className={styles.reviewImage}
                    src={item.previewUrl}
                    alt={item.fileName}
                  />
                )}

                <div className={styles.reviewCardBody}>
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
                    {item.budgetCategory || "카테고리 미입력"}
                  </span>

                  <button
                    type="button"
                    className={styles.reviewButton}
                    onClick={() => openEditModal(item)}
                  >
                    수정
                  </button>
                  {item.isExtracting && (
                    <span className={styles.reviewExtractStatus}>
                      OCR 처리 중이어도 직접 수정할 수 있습니다.
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
                onClick={closeEditModal}
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.originalColumn}>
                <h3 className={styles.modalSectionTitle}>원본</h3>
                {editingItem.fileName.toLowerCase().endsWith(".pdf") ? (
                  <div className={styles.modalPdfPreview}>PDF 증빙 파일</div>
                ) : (
                  <img
                    className={styles.modalImage}
                    src={editingItem.previewUrl}
                    alt={editingItem.fileName}
                  />
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
                  value={editForm.amount}
                  onChange={(event) =>
                    setEditForm((prevForm) => ({
                      ...prevForm,
                      amount: event.target.value,
                    }))
                  }
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

                <label className={styles.formLabel} htmlFor="budget-category-edit">
                  항목
                </label>
                <input
                  id="budget-category-edit"
                  className={styles.formInput}
                  value={editForm.budgetCategory}
                  placeholder="예: 행사비"
                  onChange={(event) =>
                    setEditForm((prevForm) => ({
                      ...prevForm,
                      budgetCategory: event.target.value,
                    }))
                  }
                />

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
                    onClick={closeEditModal}
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
