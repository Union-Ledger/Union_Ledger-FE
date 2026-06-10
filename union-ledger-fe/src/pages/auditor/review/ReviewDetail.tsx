import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuditApi, {
  type AuditEvidence,
  type AuditSettlementDetailResponse,
} from "@/hooks/useAuditApi";
import * as styles from "@/pages/auditor/review/ReviewDetail.css";

const parseAmount = (amount: string) => {
  const parsed = Number(amount);
  return Number.isFinite(parsed) ? Math.abs(parsed) : 0;
};

const formatMoney = (amount: number) => {
  return `₩${amount.toLocaleString("ko-KR")}`;
};

const getStatusLabel = (status: string | undefined) => {
  const statusMap: Record<string, string> = {
    matched: "매칭",
    amount_mismatch: "금액 불일치",
    date_mismatch: "날짜 불일치",
    missing_bank_transaction: "거래내역 누락",
    missing_evidence: "증빙 누락",
    manually_resolved: "수동 해결",
  };

  return status ? (statusMap[status] ?? status) : "대조 전";
};

const getAuditStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    approved: "승인 완료",
    rejected: "반려",
    under_audit: "검토 중",
    submitted: "검토 대기",
    resubmitted: "재제출",
  };

  return statusMap[status] ?? status;
};

const formatTimestamp = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const inferEvidenceFileType = (blob: Blob, fileName: string) => {
  if (blob.type && blob.type !== "application/octet-stream") {
    return blob.type;
  }

  const extension = fileName.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    pdf: "application/pdf",
  };

  return extension ? (typeMap[extension] ?? blob.type) : blob.type;
};

const buildReviewData = (data: AuditSettlementDetailResponse) => {
  const totalAmount = data.evidences.reduce(
    (sum, evidence) => sum + parseAmount(evidence.amount),
    0,
  );

  const categoryMap = new Map<
    string,
    { category: string; count: number; totalAmount: number }
  >();
  data.evidences.forEach((evidence) => {
    const category = evidence.budget_category || "미분류";
    const prev = categoryMap.get(category);
    categoryMap.set(category, {
      category,
      count: (prev?.count ?? 0) + 1,
      totalAmount: (prev?.totalAmount ?? 0) + parseAmount(evidence.amount),
    });
  });

  const evidenceRows = data.evidences.map((evidence) => {
    const reconciliation = data.reconciliation_results.find(
      (result) => result.evidence_id === evidence.id,
    );
    const bankTransaction = data.bank_transactions.find(
      (transaction) => transaction.id === reconciliation?.bank_transaction_id,
    );
    const existingComment = data.comments.find(
      (comment) => comment.evidence_id === evidence.id,
    );

    return {
      id: evidence.id,
      date: evidence.evidence_date || bankTransaction?.transaction_date || "-",
      category: evidence.budget_category || "미분류",
      merchantName:
        evidence.merchant_name || bankTransaction?.description || "내역 없음",
      amount: parseAmount(evidence.amount),
      reconciliationStatus: reconciliation?.status,
      reconciliationNotes: reconciliation?.notes,
      existingCommentId: existingComment?.id ?? null,
    };
  });

  // 증빙이 없는 은행 거래(누락) — 감사가 반드시 확인해야 하는 항목
  const bankOnlyRows = data.reconciliation_results
    .filter((result) => result.status === "missing_evidence")
    .map((result) => {
      const bankTransaction = data.bank_transactions.find(
        (transaction) => transaction.id === result.bank_transaction_id,
      );
      return {
        id: result.id,
        date: bankTransaction?.transaction_date || "-",
        description: bankTransaction?.description || "내역 없음",
        amount: bankTransaction ? parseAmount(bankTransaction.amount) : 0,
        notes: result.notes,
      };
    });

  const overallComments = data.comments.filter(
    (comment) => !comment.evidence_id,
  );

  return {
    settlement: { ...data.settlement, totalAmount },
    categorySummaries: Array.from(categoryMap.values()),
    evidenceRows,
    bankOnlyRows,
    overallComments,
  };
};

const ReviewDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    getAuditSettlementDetail,
    postAuditComment,
    patchAuditComment,
    downloadEvidenceFile,
    postApproveSettlement,
    postRejectSettlement,
  } = useAuditApi();

  const [detailData, setDetailData] =
    useState<AuditSettlementDetailResponse | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {},
  );
  const [savingEvidenceId, setSavingEvidenceId] = useState<string | null>(null);
  const [auditComment, setAuditComment] = useState("");
  const [processingDecision, setProcessingDecision] = useState<
    "approve" | "reject" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // 증빙 이미지 모달
  const [modalEvidence, setModalEvidence] = useState<AuditEvidence | null>(
    null,
  );
  const [modalFileUrl, setModalFileUrl] = useState<string | null>(null);
  const [modalFileType, setModalFileType] = useState<string>("");
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const [getAuditSettlementDetailOnce] = useState(
    () => getAuditSettlementDetail,
  );
  const [postAuditCommentOnce] = useState(() => postAuditComment);
  const [patchAuditCommentOnce] = useState(() => patchAuditComment);
  const [downloadEvidenceFileOnce] = useState(() => downloadEvidenceFile);
  const [postApproveSettlementOnce] = useState(() => postApproveSettlement);
  const [postRejectSettlementOnce] = useState(() => postRejectSettlement);

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) {
        setErrorMessage("결산안 정보를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getAuditSettlementDetailOnce(id);
        setDetailData(data);

        // 항목별 기존 코멘트를 입력칸 초깃값으로 채움 (evidenceId 기준)
        const drafts: Record<string, string> = {};
        data.comments.forEach((comment) => {
          if (
            comment.evidence_id &&
            drafts[comment.evidence_id] === undefined
          ) {
            drafts[comment.evidence_id] = comment.comment;
          }
        });
        setCommentDrafts(drafts);
      } catch (error) {
        console.error("감사 결산안 상세 조회 실패", error);
        setErrorMessage("결산안 상세 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [getAuditSettlementDetailOnce, id]);

  const reviewData = useMemo(() => {
    return detailData ? buildReviewData(detailData) : null;
  }, [detailData]);
  const isApproved = reviewData?.settlement.status === "approved";

  const handleSaveEvidenceComment = async (evidenceId: string) => {
    if (isApproved || !id || !detailData) return;

    const draft = (commentDrafts[evidenceId] ?? "").trim();
    if (!draft) {
      alert("코멘트 내용을 입력해주세요.");
      return;
    }

    const existing = detailData.comments.find(
      (comment) => comment.evidence_id === evidenceId,
    );

    try {
      setSavingEvidenceId(evidenceId);

      if (existing) {
        const updated = await patchAuditCommentOnce(existing.id, draft);
        setDetailData((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.map((comment) =>
                  comment.id === existing.id ? updated : comment,
                ),
              }
            : prev,
        );
      } else {
        const created = await postAuditCommentOnce(id, draft, evidenceId);
        setDetailData((prev) =>
          prev ? { ...prev, comments: [...prev.comments, created] } : prev,
        );
      }
    } catch (error) {
      console.error("감사 코멘트 저장 실패", error);
      alert("코멘트 저장에 실패했습니다. (작성자 본인만 수정할 수 있어요)");
    } finally {
      setSavingEvidenceId(null);
    }
  };

  const openEvidenceModal = async (evidenceId: string) => {
    if (!detailData) return;
    const evidence = detailData.evidences.find(
      (item) => item.id === evidenceId,
    );
    if (!evidence) return;

    setModalEvidence(evidence);
    setModalLoading(true);
    setModalFileUrl(null);
    setModalFileType("");
    setModalErrorMessage("");

    try {
      const blob = await downloadEvidenceFileOnce(evidenceId);
      setModalFileUrl(URL.createObjectURL(blob));
      setModalFileType(
        inferEvidenceFileType(blob, evidence.source_file_name ?? ""),
      );
    } catch (error) {
      console.error("증빙 원본 조회 실패", error);
      setModalErrorMessage(
        error instanceof Error
          ? error.message
          : "증빙 원본 파일을 불러오지 못했습니다.",
      );
    } finally {
      setModalLoading(false);
    }
  };

  const closeEvidenceModal = () => {
    if (modalFileUrl) {
      URL.revokeObjectURL(modalFileUrl);
    }
    setModalEvidence(null);
    setModalFileUrl(null);
    setModalFileType("");
    setModalErrorMessage("");
    setModalLoading(false);
  };

  const handleApprove = async () => {
    if (!id) {
      alert("승인할 결산안 정보가 없습니다.");
      return;
    }

    try {
      setProcessingDecision("approve");
      // 의견이 비어 있으면 코멘트를 남기지 않는다 (가짜 코멘트 기록 방지).
      await postApproveSettlementOnce({
        settlementId: id,
        comment: auditComment.trim(),
      });
      alert("결산안이 승인되었습니다.");
      navigate("/auditor/review");
    } catch (error) {
      console.error("결산안 승인 실패", error);
      alert("결산안 승인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setProcessingDecision(null);
    }
  };

  const handleReject = async () => {
    if (!id) {
      alert("반려할 결산안 정보가 없습니다.");
      return;
    }

    const comment = auditComment.trim();
    if (!comment) {
      alert("반려 사유를 입력해주세요.");
      return;
    }

    try {
      setProcessingDecision("reject");
      await postRejectSettlementOnce({ settlementId: id, comment });
      alert("결산안이 반려되었습니다.");
      navigate("/auditor/review");
    } catch (error) {
      console.error("결산안 반려 실패", error);
      alert("결산안 반려에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setProcessingDecision(null);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.stateBox}>
          결산안 상세 정보를 불러오는 중입니다.
        </div>
      </div>
    );
  }

  if (errorMessage || !reviewData) {
    return (
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/auditor/review")}
        >
          ← 목록으로
        </button>
        <div className={styles.stateBox}>
          {errorMessage || "결산안 상세 정보가 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate("/auditor/review")}
      >
        ← 목록으로
      </button>

      <div className={styles.headerContainer}>
        <div>
          <h1 className={styles.title}>{reviewData.settlement.title}</h1>
          <p className={styles.desc}>
            {reviewData.settlement.academic_year}-
            {reviewData.settlement.semester}
            {isApproved && (
              <span className={styles.approvedStatusBadge}>
                ✓ {getAuditStatusLabel(reviewData.settlement.status)}
              </span>
            )}
          </p>
        </div>

        <div className={styles.totalAmountWrapper}>
          <span className={styles.totalAmountLabel}>총 지출액</span>
          <strong className={styles.totalAmount}>
            {formatMoney(reviewData.settlement.totalAmount)}
          </strong>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>결산안</span>
          </div>

          <div className={styles.panelBody}>
            <h2 className={styles.sectionTitle}>항목별 지출 내역</h2>

            <div className={styles.categoryList}>
              {reviewData.categorySummaries.length === 0 ? (
                <div className={styles.stateBox}>
                  집계된 지출 내역이 없습니다.
                </div>
              ) : (
                reviewData.categorySummaries.map((item) => (
                  <div key={item.category} className={styles.categoryItem}>
                    <div>
                      <strong className={styles.categoryName}>
                        {item.category}
                      </strong>
                      <p className={styles.categoryCount}>{item.count}건</p>
                    </div>

                    <strong className={styles.categoryAmount}>
                      {formatMoney(item.totalAmount)}
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>증빙 · 거래 내역</span>
          </div>

          <div className={styles.panelBody}>
            <div className={styles.transactionList}>
              {reviewData.evidenceRows.length === 0 ? (
                <div className={styles.stateBox}>증빙 내역이 없습니다.</div>
              ) : (
                reviewData.evidenceRows.map((row) => {
                  const draft = commentDrafts[row.id] ?? "";

                  return (
                    <div key={row.id} className={styles.transactionItem}>
                      <div className={styles.transactionTop}>
                        <span className={styles.transactionDate}>
                          {row.date}
                        </span>
                        <span className={styles.categoryBadge}>
                          {row.category}
                        </span>
                        <span className={styles.statusBadge}>
                          {getStatusLabel(row.reconciliationStatus)}
                        </span>
                        <button
                          type="button"
                          className={styles.viewEvidenceButton}
                          onClick={() => openEvidenceModal(row.id)}
                        >
                          증빙 보기
                        </button>
                      </div>

                      <strong className={styles.merchantName}>
                        {row.merchantName}
                      </strong>

                      <strong className={styles.transactionAmount}>
                        {formatMoney(row.amount)}
                      </strong>

                      {row.reconciliationNotes && (
                        <p className={styles.reconciliationNote}>
                          {row.reconciliationNotes}
                        </p>
                      )}

                      <div className={styles.commentBox}>
                        <span className={styles.commentIcon}>▱</span>
                        <input
                          className={styles.commentInput}
                          placeholder="이 항목에 대한 코멘트 작성"
                          value={draft}
                          disabled={isApproved}
                          onChange={(event) =>
                            setCommentDrafts((prev) => ({
                              ...prev,
                              [row.id]: event.target.value,
                            }))
                          }
                        />
                        {!isApproved && (
                          <button
                            type="button"
                            className={styles.commentSaveButton}
                            disabled={
                              savingEvidenceId === row.id || !draft.trim()
                            }
                            onClick={() => handleSaveEvidenceComment(row.id)}
                          >
                            {savingEvidenceId === row.id ? "저장 중" : "저장"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {reviewData.bankOnlyRows.length > 0 && (
                <>
                  <h3 className={styles.subSectionTitle}>
                    증빙 없는 거래내역 ({reviewData.bankOnlyRows.length})
                  </h3>
                  {reviewData.bankOnlyRows.map((row) => (
                    <div key={row.id} className={styles.missingItem}>
                      <div className={styles.transactionTop}>
                        <span className={styles.transactionDate}>
                          {row.date}
                        </span>
                        <span className={styles.missingBadge}>증빙 누락</span>
                      </div>
                      <strong className={styles.merchantName}>
                        {row.description}
                      </strong>
                      <strong className={styles.transactionAmount}>
                        {formatMoney(row.amount)}
                      </strong>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {reviewData.overallComments.length > 0 && (
        <section className={styles.auditPanel}>
          <h2 className={styles.sectionTitle}>전체 감사 의견 기록</h2>
          <div className={styles.overallCommentsPanel}>
            {reviewData.overallComments.map((comment) => (
              <div key={comment.id} className={styles.overallCommentItem}>
                <div className={styles.overallCommentMeta}>
                  {comment.author_name ?? "감사위원"} ·{" "}
                  {formatTimestamp(comment.created_at)}
                </div>
                <div className={styles.overallCommentText}>
                  {comment.comment}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isApproved ? (
        <section className={styles.auditCompletePanel}>
          <div className={styles.auditCompleteTitle}>✓ 감사 완료</div>
          <p className={styles.auditCompleteDescription}>
            이 결산안은 이미 감사가 완료되었습니다. 검토 내용은 위의 항목별
            코멘트를 참고하세요.
          </p>
        </section>
      ) : (
        <section className={styles.auditPanel}>
          <h2 className={styles.sectionTitle}>전체 감사 의견</h2>

          <textarea
            className={styles.auditTextarea}
            placeholder="결산안 전체에 대한 최종 의견을 작성하세요 (반려 시 필수)"
            value={auditComment}
            onChange={(event) => setAuditComment(event.target.value)}
          />

          <div className={styles.actionContainer}>
            <button
              type="button"
              className={styles.approveButton}
              onClick={handleApprove}
              disabled={processingDecision !== null}
            >
              {processingDecision === "approve" ? "승인 중..." : "◎ 승인"}
            </button>

            <button
              type="button"
              className={styles.rejectButton}
              onClick={handleReject}
              disabled={processingDecision !== null}
            >
              {processingDecision === "reject" ? "반려 중..." : "⊗ 반려"}
            </button>
          </div>
        </section>
      )}

      {modalEvidence && (
        <div className={styles.modalOverlay} onClick={closeEvidenceModal}>
          <div
            className={styles.modalCard}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalTitleRow}>
              <span className={styles.modalTitle}>
                {modalEvidence.merchant_name || "증빙 상세"}
              </span>
              <button
                type="button"
                className={styles.modalCloseButton}
                onClick={closeEvidenceModal}
              >
                ✕
              </button>
            </div>

            {modalLoading ? (
              <div className={styles.modalStateText}>
                원본을 불러오는 중입니다.
              </div>
            ) : modalFileUrl ? (
              modalFileType.startsWith("image/") ? (
                <div className={styles.modalImageWrap}>
                  <img
                    className={styles.modalImage}
                    src={modalFileUrl}
                    alt="증빙 원본"
                  />
                </div>
              ) : (
                <div className={styles.modalStateText}>
                  이미지로 표시할 수 없는 파일입니다 (예: PDF).
                  <br />
                  <button
                    type="button"
                    className={styles.modalOpenLink}
                    onClick={() => window.open(modalFileUrl, "_blank")}
                  >
                    새 탭에서 원본 열기
                  </button>
                </div>
              )
            ) : (
              <div className={styles.modalStateText}>
                {modalErrorMessage ||
                  "증빙 원본 파일을 불러오지 못했습니다."}
              </div>
            )}

            <div className={styles.modalFields}>
              <div className={styles.modalFieldRow}>
                <span className={styles.modalFieldLabel}>날짜</span>
                <span className={styles.modalFieldValue}>
                  {modalEvidence.evidence_date || "-"}
                </span>
              </div>
              <div className={styles.modalFieldRow}>
                <span className={styles.modalFieldLabel}>금액</span>
                <span className={styles.modalFieldValue}>
                  {formatMoney(parseAmount(modalEvidence.amount))}
                </span>
              </div>
              <div className={styles.modalFieldRow}>
                <span className={styles.modalFieldLabel}>결제수단</span>
                <span className={styles.modalFieldValue}>
                  {modalEvidence.payment_method || "-"}
                </span>
              </div>
              <div className={styles.modalFieldRow}>
                <span className={styles.modalFieldLabel}>예산 항목</span>
                <span className={styles.modalFieldValue}>
                  {modalEvidence.budget_category || "미분류"}
                </span>
              </div>
              <div className={styles.modalFieldRow}>
                <span className={styles.modalFieldLabel}>파일명</span>
                <span className={styles.modalFieldValue}>
                  {modalEvidence.source_file_name || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDetail;
