import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuditApi, {
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
  };

  return status ? (statusMap[status] ?? status) : "대조 전";
};

const getAuditStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    approved: "승인 완료",
    rejected: "반려",
    under_audit: "검토 중",
    submitted: "검토 대기",
    ready_for_review: "검토 대기",
    resubmitted: "재제출",
  };

  return statusMap[status] ?? status;
};

const transformReviewDetail = (data: AuditSettlementDetailResponse) => {
  const totalAmount = data.evidences.reduce((sum, evidence) => {
    return sum + parseAmount(evidence.amount);
  }, 0);

  const categoryMap = new Map<
    string,
    {
      category: string;
      count: number;
      totalAmount: number;
    }
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

  const transactions = data.evidences.map((evidence) => {
    const reconciliation = data.reconciliation_results.find(
      (result) => result.evidence_id === evidence.id,
    );

    const bankTransaction = data.bank_transactions.find(
      (transaction) => transaction.id === reconciliation?.bank_transaction_id,
    );

    const comment = data.comments.find(
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
      commentId: comment?.id ?? null,
      comment: comment?.comment ?? "",
    };
  });

  return {
    settlement: {
      ...data.settlement,
      totalAmount,
    },
    categorySummaries: Array.from(categoryMap.values()),
    transactions,
  };
};

const ReviewDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    getAuditSettlementDetail,
    patchAuditComment,
    postApproveSettlement,
    postRejectSettlement,
  } = useAuditApi();

  const [detailData, setDetailData] =
    useState<AuditSettlementDetailResponse | null>(null);
  const [commentValues, setCommentValues] = useState<Record<string, string>>(
    {},
  );
  const [savingCommentId, setSavingCommentId] = useState<string | null>(null);
  const [auditComment, setAuditComment] = useState("");
  const [processingDecision, setProcessingDecision] = useState<
    "approve" | "reject" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [getAuditSettlementDetailOnce] = useState(
    () => getAuditSettlementDetail,
  );
  const [patchAuditCommentOnce] = useState(() => patchAuditComment);
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

        const nextCommentValues = data.comments.reduce<Record<string, string>>(
          (acc, comment) => {
            acc[comment.id] = comment.comment;
            return acc;
          },
          {},
        );
        setCommentValues(nextCommentValues);
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
    return detailData ? transformReviewDetail(detailData) : null;
  }, [detailData]);
  const isApproved = reviewData?.settlement.status === "approved";

  const handleChangeComment = (commentId: string, comment: string) => {
    if (isApproved) return;

    setCommentValues((prev) => ({
      ...prev,
      [commentId]: comment,
    }));
  };

  const handleSaveComment = async (commentId: string) => {
    if (isApproved) return;

    const nextComment = commentValues[commentId] ?? "";

    try {
      setSavingCommentId(commentId);
      const updatedComment = await patchAuditCommentOnce(
        commentId,
        nextComment,
      );

      setDetailData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: prev.comments.map((comment) =>
            comment.id === commentId ? updatedComment : comment,
          ),
        };
      });
    } catch (error) {
      console.error("감사 코멘트 수정 실패", error);
      alert("감사 코멘트 수정에 실패했습니다.");
    } finally {
      setSavingCommentId(null);
    }
  };

  const handleApprove = async () => {
    if (!id) {
      alert("승인할 결산안 정보가 없습니다.");
      return;
    }

    const comment = auditComment.trim() || "결산안을 승인합니다.";

    try {
      setProcessingDecision("approve");
      await postApproveSettlementOnce({
        settlementId: id,
        comment,
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
      await postRejectSettlementOnce({
        settlementId: id,
        comment,
      });
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
        <div className={styles.stateBox}>결산안 상세 정보를 불러오는 중입니다.</div>
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
                <div className={styles.stateBox}>집계된 지출 내역이 없습니다.</div>
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
            <span>거래 내역 상세</span>
          </div>

          <div className={styles.panelBody}>
            <div className={styles.transactionList}>
              {reviewData.transactions.length === 0 ? (
                <div className={styles.stateBox}>거래 내역이 없습니다.</div>
              ) : (
                reviewData.transactions.map((transaction) => {
                  const hasEditableComment =
                    !isApproved && Boolean(transaction.commentId);
                  const commentValue = transaction.commentId
                    ? (commentValues[transaction.commentId] ??
                      transaction.comment)
                    : transaction.comment;

                  return (
                    <div
                      key={transaction.id}
                      className={styles.transactionItem}
                    >
                      <div className={styles.transactionTop}>
                        <span className={styles.transactionDate}>
                          {transaction.date}
                        </span>
                        <span className={styles.categoryBadge}>
                          {transaction.category}
                        </span>
                        <span className={styles.statusBadge}>
                          {getStatusLabel(transaction.reconciliationStatus)}
                        </span>
                      </div>

                      <strong className={styles.merchantName}>
                        {transaction.merchantName}
                      </strong>

                      <strong className={styles.transactionAmount}>
                        {formatMoney(transaction.amount)}
                      </strong>

                      {transaction.reconciliationNotes && (
                        <p className={styles.reconciliationNote}>
                          {transaction.reconciliationNotes}
                        </p>
                      )}

                      <div className={styles.commentBox}>
                        <span className={styles.commentIcon}>▱</span>
                        <input
                          className={styles.commentInput}
                          placeholder="이 항목에 대한 코멘트"
                          value={commentValue}
                          disabled={isApproved || !hasEditableComment}
                          onChange={(event) => {
                            if (!transaction.commentId) return;
                            handleChangeComment(
                              transaction.commentId,
                              event.target.value,
                            );
                          }}
                        />
                        {!isApproved && (
                          <button
                            type="button"
                            className={styles.commentSaveButton}
                            disabled={
                              !transaction.commentId ||
                              savingCommentId === transaction.commentId
                            }
                            onClick={() => {
                              if (!transaction.commentId) return;
                              handleSaveComment(transaction.commentId);
                            }}
                          >
                            {savingCommentId === transaction.commentId
                              ? "저장 중"
                              : "저장"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>

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
    </div>
  );
};

export default ReviewDetail;
