import { useEffect, useMemo, useState } from "react";
import * as styles from "./Create.css";
import useSettlementApi, {
  type ArtifactGenerationResponse,
  type ReconciliationResult,
  type ReconciliationRunResponse,
  type ReconciliationStatus,
  type SettlementArtifact,
} from "@/hooks/useSettlementApi";
import { useConfirm, useToast } from "@shared/components/feedback";

type ReviewFilter = "all" | "matched" | "issue";

interface ReconciliationReviewProps {
  onBack: () => void;
}

const statusLabelMap: Record<ReconciliationStatus, string> = {
  matched: "매칭",
  amount_mismatch: "금액 불일치",
  date_mismatch: "날짜 불일치",
  missing_bank_transaction: "거래내역 누락",
  missing_evidence: "증빙 누락",
  manually_resolved: "수동 해결",
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("ko-KR");
};

const formatShortId = (id: string | null) => {
  if (!id) return "-";

  return id.slice(0, 8);
};

// 매칭됐거나 수동으로 해결된 행은 더 이상 '문제'가 아니다.
const isResolvedResult = (item: ReconciliationResult) =>
  item.status === "matched" || item.status === "manually_resolved";

const isIssueResult = (item: ReconciliationResult) => !isResolvedResult(item);

// 상호명이 있으면 상호명을, 없으면 ID 일부를, 둘 다 없으면 빈 라벨을 보여준다.
const sideLabel = (
  name: string | null,
  id: string | null,
  fallbackPrefix: string,
  emptyLabel: string,
) => {
  if (name) return name;
  if (id) return `${fallbackPrefix} ${formatShortId(id)}`;
  return emptyLabel;
};

const ReconciliationReview = ({ onBack }: ReconciliationReviewProps) => {
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>("all");
  const [reconciliationData, setReconciliationData] =
    useState<ReconciliationRunResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSettlementId, setSubmittedSettlementId] = useState<
    string | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [artifacts, setArtifacts] = useState<ArtifactGenerationResponse | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadingArtifactId, setDownloadingArtifactId] = useState<
    string | null
  >(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const {
    postReconciliationRun,
    patchReconciliationResult,
    postSubmitSettlement,
    postGenerateArtifacts,
    downloadArtifact,
  } = useSettlementApi();
  const [postReconciliationRunOnce] = useState(() => postReconciliationRun);
  const [patchReconciliationResultOnce] = useState(
    () => patchReconciliationResult,
  );
  const [postSubmitSettlementOnce] = useState(() => postSubmitSettlement);
  const [postGenerateArtifactsOnce] = useState(() => postGenerateArtifacts);
  const [downloadArtifactOnce] = useState(() => downloadArtifact);
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    const runReconciliation = async () => {
      const settlementId = localStorage.getItem("currentSettlementId");

      if (!settlementId) {
        setErrorMessage("결산안 정보가 없습니다. 먼저 증빙을 업로드해주세요.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await postReconciliationRunOnce(settlementId);
        setReconciliationData(data);
      } catch (error) {
        console.error("자동 대조 실행 실패", error);
        setErrorMessage("거래내역 대조를 실행하지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    runReconciliation();
  }, [postReconciliationRunOnce]);

  const reconciliationItems = useMemo(() => {
    return reconciliationData?.results ?? [];
  }, [reconciliationData]);
  // 매칭 + 수동해결을 모두 '해결됨'으로 보고 결과 배열에서 직접 집계한다.
  // (수동 해결 시 issueCount 가 즉시 줄어들어 생성 게이트가 풀린다.)
  const totalCount = reconciliationData?.total ?? reconciliationItems.length;
  const resolvedCount = reconciliationItems.filter(isResolvedResult).length;
  const issueCount = Math.max(totalCount - resolvedCount, 0);

  const filteredItems = useMemo(() => {
    if (selectedFilter === "matched") {
      return reconciliationItems.filter(isResolvedResult);
    }

    if (selectedFilter === "issue") {
      return reconciliationItems.filter(isIssueResult);
    }

    return reconciliationItems;
  }, [reconciliationItems, selectedFilter]);

  const canGenerate =
    !isLoading &&
    !isGenerating &&
    !isSubmitting &&
    !errorMessage &&
    issueCount === 0;

  const resolveSettlementId = () =>
    reconciliationData?.settlement_id ||
    localStorage.getItem("currentSettlementId");

  // 결산안 Excel + 증빙 PDF 생성 (제출과 분리된 단계)
  const handleGenerate = async () => {
    if (!canGenerate) return;

    const settlementId = resolveSettlementId();

    if (!settlementId) {
      setErrorMessage("결산안 정보가 없습니다. 먼저 증빙을 업로드해주세요.");
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage("");

      const result = await postGenerateArtifactsOnce(settlementId);
      setArtifacts(result);

      if (
        result.excel.status === "failed" ||
        result.pdf.status === "failed"
      ) {
        toast.error("일부 산출물 생성에 실패했습니다. 아래 상태를 확인해주세요.");
      } else {
        toast.success("결산안 생성이 완료되었습니다.");
      }
    } catch (error) {
      console.error("산출물 생성 실패", error);
      toast.error("산출물 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 감사위원에게 제출 (산출물 생성 후)
  const handleSubmit = async () => {
    const settlementId = resolveSettlementId();

    if (!settlementId) {
      setErrorMessage("결산안 정보가 없습니다. 먼저 증빙을 업로드해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const submittedSettlement = await postSubmitSettlementOnce(settlementId);
      setSubmittedSettlementId(submittedSettlement.id);
      toast.success("결산안이 감사위원에게 제출되었습니다.");
    } catch (error) {
      console.error("결산안 제출 실패", error);
      toast.error("결산안 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 불일치/누락 건을 수동으로 '해결됨' 처리 (PATCH /reconciliation/{id})
  const handleResolve = async (item: ReconciliationResult) => {
    const ok = await confirm({
      title: "수동으로 해결 처리할까요?",
      description:
        "감사위원에게 '수동 해결'로 표시됩니다. 실제 불일치가 남아 있지 않은지 다시 확인해주세요.",
      confirmLabel: "해결 처리",
    });

    if (!ok) return;

    try {
      setResolvingId(item.id);

      const updated = await patchReconciliationResultOnce(item.id, {
        status: "manually_resolved",
        notes: item.notes ?? "재정담당자가 수동으로 확인 처리했습니다.",
      });

      setReconciliationData((prev) =>
        prev
          ? {
              ...prev,
              results: prev.results.map((row) =>
                row.id === updated.id ? updated : row,
              ),
            }
          : prev,
      );
      toast.success("수동 해결 처리가 완료되었습니다.");
    } catch (error) {
      console.error("대조 결과 수동 처리 실패", error);
      toast.error("수동 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setResolvingId(null);
    }
  };

  // 생성된 산출물 다운로드
  const handleDownload = async (
    artifact: SettlementArtifact,
    filename: string,
  ) => {
    try {
      setDownloadingArtifactId(artifact.id);

      const blob = await downloadArtifactOnce(artifact.id);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("산출물 다운로드 실패", error);
      toast.error("산출물 다운로드에 실패했습니다.");
    } finally {
      setDownloadingArtifactId(null);
    }
  };

  return (
    <div className={styles.reconciliationBox}>
      <div className={styles.reconciliationTitleBox}>
        <div>
          <div className={styles.reconciliationTitle}>
            <span className={styles.reconciliationIcon}>⊙</span>
            거래내역 vs 결산안 검토
          </div>
          <div className={styles.reconciliationDescription}>
            생성 전에 모든 거래내역이 올바르게 반영되었는지 확인하세요
          </div>
        </div>
      </div>

      <div className={styles.reconciliationTabBox}>
        <button
          type="button"
          className={`${styles.reconciliationTab} ${
            selectedFilter === "all" ? styles.reconciliationTabActive : ""
          }`}
          onClick={() => setSelectedFilter("all")}
        >
          전체 ({totalCount})
        </button>

        <button
          type="button"
          className={`${styles.reconciliationTab} ${
            selectedFilter === "matched" ? styles.reconciliationTabActive : ""
          }`}
          onClick={() => setSelectedFilter("matched")}
        >
          매칭 ({resolvedCount})
        </button>

        <button
          type="button"
          className={`${styles.reconciliationTab} ${
            selectedFilter === "issue" ? styles.reconciliationTabActive : ""
          }`}
          onClick={() => setSelectedFilter("issue")}
        >
          문제 ({issueCount})
        </button>
      </div>

      <div className={styles.reconciliationList}>
        {isLoading ? (
          <div className={styles.reconciliationEmpty}>
            거래내역과 증빙을 대조하는 중입니다.
          </div>
        ) : errorMessage ? (
          <div className={styles.reconciliationEmpty}>{errorMessage}</div>
        ) : filteredItems.length === 0 ? (
          <div className={styles.reconciliationEmpty}>
            표시할 대조 결과가 없습니다.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isResolved = isResolvedResult(item);

            return (
              <div
                key={item.id}
                className={`${styles.reconciliationItem} ${
                  isResolved
                    ? styles.reconciliationItemMatched
                    : styles.reconciliationItemIssue
                }`}
              >
                <div className={styles.reconciliationItemTop}>
                  <span className={styles.reconciliationDate}>
                    {formatDate(item.created_at)}
                  </span>
                  <span className={styles.reconciliationCategory}>
                    {statusLabelMap[item.status]}
                  </span>
                  <span
                    className={
                      isResolved
                        ? styles.reconciliationCheckIcon
                        : styles.reconciliationWarningIcon
                    }
                  >
                    {isResolved ? "✓" : "△"}
                  </span>
                </div>

                <div className={styles.reconciliationMerchant}>
                  {sideLabel(
                    item.evidence_merchant_name,
                    item.evidence_id,
                    "증빙",
                    "증빙 없음",
                  )}{" "}
                  ·{" "}
                  {sideLabel(
                    item.bank_merchant_name,
                    item.bank_transaction_id,
                    "거래내역",
                    "거래내역 없음",
                  )}
                </div>

                {item.notes && (
                  <div className={styles.reconciliationIssueMessage}>
                    {isResolved ? "메모" : "△"} {item.notes}
                  </div>
                )}

                {!isResolved && !submittedSettlementId && (
                  <button
                    type="button"
                    className={styles.reconciliationResolveButton}
                    disabled={resolvingId === item.id}
                    onClick={() => handleResolve(item)}
                  >
                    {resolvingId === item.id ? "처리 중..." : "수동 해결 처리"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {reconciliationData && (
        <div className={styles.reconciliationStatsBox}>
          <div className={styles.reconciliationStatsItem}>
            금액 불일치 {reconciliationData.amount_mismatch}건
          </div>
          <div className={styles.reconciliationStatsItem}>
            날짜 불일치 {reconciliationData.date_mismatch}건
          </div>
          <div className={styles.reconciliationStatsItem}>
            거래내역 누락 {reconciliationData.missing_bank_transaction}건
          </div>
          <div className={styles.reconciliationStatsItem}>
            증빙 누락 {reconciliationData.missing_evidence}건
          </div>
        </div>
      )}

      {artifacts && (
        <div className={styles.artifactPanel}>
          <div className={styles.artifactPanelTitle}>생성된 산출물</div>

          <div className={styles.artifactRow}>
            <span className={styles.artifactName}>결산안 (Excel)</span>
            {artifacts.excel.status === "completed" ? (
              <button
                type="button"
                className={styles.artifactDownloadButton}
                disabled={downloadingArtifactId === artifacts.excel.id}
                onClick={() => handleDownload(artifacts.excel, "결산안.xlsx")}
              >
                {downloadingArtifactId === artifacts.excel.id
                  ? "다운로드 중..."
                  : "다운로드"}
              </button>
            ) : (
              <span className={styles.artifactStatusFailed}>생성 실패</span>
            )}
          </div>

          <div className={styles.artifactRow}>
            <span className={styles.artifactName}>증빙 모음 (PDF)</span>
            {artifacts.pdf.status === "completed" ? (
              <button
                type="button"
                className={styles.artifactDownloadButton}
                disabled={downloadingArtifactId === artifacts.pdf.id}
                onClick={() => handleDownload(artifacts.pdf, "증빙.pdf")}
              >
                {downloadingArtifactId === artifacts.pdf.id
                  ? "다운로드 중..."
                  : "다운로드"}
              </button>
            ) : (
              <span className={styles.artifactStatusFailed}>생성 실패</span>
            )}
          </div>

          {artifacts.excel_error && (
            <div className={styles.artifactStatusFailed}>
              결산안 실패 사유: {artifacts.excel_error}
            </div>
          )}
          {artifacts.pdf_error && (
            <div className={styles.artifactStatusFailed}>
              증빙 PDF 실패 사유: {artifacts.pdf_error}
            </div>
          )}
        </div>
      )}

      <div className={styles.reconciliationFooter}>
        <button
          type="button"
          className={styles.reconciliationBackButton}
          onClick={onBack}
        >
          뒤로
        </button>

        {!artifacts ? (
          <button
            type="button"
            className={styles.reconciliationGenerateButton}
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            {isGenerating
              ? "생성 중..."
              : canGenerate
                ? "결산안 생성하기"
                : "문제 해결 후 생성 가능"}
          </button>
        ) : (
          <button
            type="button"
            className={styles.reconciliationGenerateButton}
            disabled={isSubmitting || Boolean(submittedSettlementId)}
            onClick={handleSubmit}
          >
            {submittedSettlementId
              ? "제출 완료"
              : isSubmitting
                ? "제출 중..."
                : "감사위원에게 제출"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReconciliationReview;
