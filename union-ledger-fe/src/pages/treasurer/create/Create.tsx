import { useEffect, useState } from "react";
import * as styles from "./Create.css";
import { fileData } from "./fileData.ts";
import { checklistItems } from "./checklist.ts";
import eye from "@assets/eye.svg";
import ReconciliationReview from "@pages/treasurer/create/ReconciliationReview";
import useSettlementApi, {
  type ExpenseSummaryResponse,
  type SettlementComment,
  type SettlementResponse,
} from "@/hooks/useSettlementApi";

const formatMoney = (amount: string) => {
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount)) {
    return "₩0";
  }

  return `₩${Math.round(parsedAmount).toLocaleString("ko-KR")}`;
};

const formatDate = (date: string | null | undefined) => {
  if (!date) {
    return "-";
  }

  return date.slice(0, 10);
};

const formatSummaryDate = (date: string) => date.replaceAll("-", ".");

const formatExpenseSummaryPeriod = (summary: ExpenseSummaryResponse) => {
  const semester = summary.semester.includes("학기")
    ? summary.semester
    : `${summary.semester}학기`;

  return `${summary.academic_year}학년도 ${semester} (${formatSummaryDate(
    summary.period_start,
  )} - ${formatSummaryDate(summary.period_end)})`;
};

interface RejectedSettlementNoticeProps {
  settlement: SettlementResponse;
  comments: SettlementComment[];
  resubmitMessage: string;
  isResubmitting: boolean;
  onCheckSettlement: () => void;
  onMessageChange: (message: string) => void;
  onResubmit: () => void;
}

const RejectedSettlementNotice = ({
  settlement,
  comments,
  resubmitMessage,
  isResubmitting,
  onCheckSettlement,
  onMessageChange,
  onResubmit,
}: RejectedSettlementNoticeProps) => {
  const primaryComment =
    comments[0]?.comment ??
    "감사위원의 검토 결과 일부 수정이 필요합니다. 수정 후 재제출해주세요.";
  const reviewerName = comments[0]?.author_name ?? "감사위원";
  const rejectedAt = formatDate(settlement.audited_at ?? settlement.updated_at);
  const issueItems = comments.filter((comment) => comment.evidence_id);

  return (
    <section className={styles.rejectedPanel}>
      <div className={styles.rejectedHeader}>
        <div className={styles.rejectedTitleRow}>
          <span className={styles.rejectedIcon}>×</span>
          <div className={styles.rejectedTitle}>
            결산안 반려됨 - 수정 후 재제출 필요
          </div>
        </div>
        <div className={styles.rejectedDescription}>
          감사위원의 검토 결과 일부 수정이 필요합니다
        </div>
      </div>

      <div className={styles.rejectedDetailBox}>
        <div className={styles.rejectedMetaRow}>
          <div>
            <div className={styles.rejectedMetaLabel}>반려 일시</div>
            <div className={styles.rejectedMetaValue}>{rejectedAt}</div>
          </div>
          <div className={styles.rejectedReviewerBox}>
            <div className={styles.rejectedMetaLabel}>검토자</div>
            <div className={styles.rejectedMetaValue}>{reviewerName}</div>
          </div>
        </div>

        <div className={styles.rejectedSectionTitle}>감사위원 코멘트:</div>
        <div className={styles.rejectedQuote}>"{primaryComment}"</div>

        <div className={styles.rejectedSectionTitle}>수정 필요 항목:</div>
        <div className={styles.rejectedIssueList}>
          {issueItems.length > 0 ? (
            issueItems.map((comment) => (
              <div key={comment.id} className={styles.rejectedIssueItem}>
                <span className={styles.rejectedIssueIcon}>△</span>
                <div>
                  <div className={styles.rejectedIssueTitle}>
                    증빙 ID: {comment.evidence_id?.slice(0, 8)}
                  </div>
                  <div className={styles.rejectedIssueDescription}>
                    {comment.comment}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.rejectedIssueItem}>
              <span className={styles.rejectedIssueIcon}>△</span>
              <div>
                <div className={styles.rejectedIssueTitle}>검토 코멘트 확인</div>
                <div className={styles.rejectedIssueDescription}>
                  감사위원 코멘트를 확인하고 필요한 증빙과 거래내역을 수정해주세요.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.rejectedDivider} />

        <label className={styles.rejectedSectionTitle} htmlFor="resubmit-note">
          재제출 메시지 (감사위원에게 전달)
        </label>
        <textarea
          id="resubmit-note"
          className={styles.rejectedTextarea}
          value={resubmitMessage}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="수정한 내용을 간단히 설명해주세요. 예: 증빙 금액을 거래내역과 일치하도록 수정했습니다."
        />
        <div className={styles.rejectedHelper}>
          감사위원이 재검토 시 이 메시지를 참고합니다.
        </div>

        <div className={styles.rejectedActionRow}>
          <button
            type="button"
            className={styles.rejectedOutlineButton}
            onClick={onCheckSettlement}
          >
            <img
              className={styles.buttonIcon}
              src={eye}
              alt=""
              aria-hidden="true"
            />
            현재 결산안 확인
          </button>
          <button
            type="button"
            className={styles.rejectedSubmitButton}
            onClick={onResubmit}
            disabled={isResubmitting}
          >
            {isResubmitting ? "재제출 중..." : "수정 완료 - 재제출"}
          </button>
        </div>
      </div>
    </section>
  );
};

const Create = () => {
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [expenseSummary, setExpenseSummary] =
    useState<ExpenseSummaryResponse | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");
  const [settlement, setSettlement] = useState<SettlementResponse | null>(null);
  const [settlementComments, setSettlementComments] = useState<
    SettlementComment[]
  >([]);
  const [resubmitMessage, setResubmitMessage] = useState("");
  const [isResubmitting, setIsResubmitting] = useState(false);

  const {
    getExpenseSummary,
    getSettlement,
    getSettlementComments,
    postResubmitSettlement,
  } = useSettlementApi();
  const [getExpenseSummaryOnce] = useState(() => getExpenseSummary);
  const [getSettlementOnce] = useState(() => getSettlement);
  const [getSettlementCommentsOnce] = useState(() => getSettlementComments);
  const [postResubmitSettlementOnce] = useState(() => postResubmitSettlement);

  useEffect(() => {
    const fetchExpenseSummary = async () => {
      const settlementId = localStorage.getItem("currentSettlementId");

      if (!settlementId) {
        setSummaryError("결산안 정보가 없습니다. 먼저 증빙을 업로드해주세요.");
        setIsSummaryLoading(false);
        return;
      }

      try {
        setIsSummaryLoading(true);
        setSummaryError("");

        const data = await getExpenseSummaryOnce(settlementId);
        setExpenseSummary(data);
      } catch (error) {
        console.error("지출 집계 조회 실패", error);
        setSummaryError("지출 집계를 불러오지 못했습니다.");
      } finally {
        setIsSummaryLoading(false);
      }
    };

    fetchExpenseSummary();
  }, [getExpenseSummaryOnce]);

  useEffect(() => {
    const fetchSettlementStatus = async () => {
      const settlementId = localStorage.getItem("currentSettlementId");

      if (!settlementId) {
        return;
      }

      try {
        const data = await getSettlementOnce(settlementId);
        setSettlement(data);

        if (data.status === "rejected") {
          const comments = await getSettlementCommentsOnce(settlementId).catch(
            () => [],
          );
          setSettlementComments(comments);
        } else {
          setSettlementComments([]);
        }
      } catch (error) {
        console.error("결산안 상태 조회 실패", error);
      }
    };

    fetchSettlementStatus();
  }, [getSettlementCommentsOnce, getSettlementOnce]);

  const handleResubmit = async () => {
    const settlementId =
      settlement?.id ?? localStorage.getItem("currentSettlementId");
    const trimmedMessage = resubmitMessage.trim();

    if (!settlementId) {
      alert("재제출할 결산안 정보가 없습니다.");
      return;
    }

    if (!trimmedMessage) {
      alert("감사위원에게 전달할 재제출 메시지를 입력해주세요.");
      return;
    }

    try {
      setIsResubmitting(true);
      const data = await postResubmitSettlementOnce({
        settlementId,
        comment: trimmedMessage,
      });
      setSettlement(data);
      setResubmitMessage("");
      alert("결산안이 재제출되었습니다.");
    } catch (error) {
      console.error("결산안 재제출 실패", error);
      alert("결산안 재제출에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsResubmitting(false);
    }
  };

  const summaryItems = expenseSummary?.by_category ?? [];
  const isRejected = settlement?.status === "rejected";

  return (
    <div className={styles.container}>
      <div className={styles.titleBox}>
        <div className={styles.title}>결산안 생성</div>
        <div className={styles.description}>
          모든 증빙과 거래내역 대조가 완료되면 최종 결산안을 생성하세요
        </div>
      </div>

      {isRejected && (
        <RejectedSettlementNotice
          settlement={settlement}
          comments={settlementComments}
          resubmitMessage={resubmitMessage}
          isResubmitting={isResubmitting}
          onCheckSettlement={() => setIsReviewMode(true)}
          onMessageChange={setResubmitMessage}
          onResubmit={handleResubmit}
        />
      )}

      <div className={styles.summaryBox}>
        <div className={styles.summaryTitleBox}>
          <div className={styles.summaryTitle}>결산안 요약</div>
          <div className={styles.summaryDescription}>
            {isSummaryLoading
              ? "-"
              : expenseSummary
                ? formatExpenseSummaryPeriod(expenseSummary)
                : "결산 기간 정보가 없습니다."}
          </div>
        </div>

        <div className={styles.summaryTotalContainer}>
          <div className={styles.summaryTotalBox({ color: "blueSoft" })}>
            <div className={styles.summaryTotalTitle({ color: "blueSoft" })}>
              총 증빙 건수
            </div>
            <div className={styles.summaryTotalAmount({ color: "blueSoft" })}>
              {isSummaryLoading ? "-" : `${expenseSummary?.total_count ?? 0}건`}
            </div>
          </div>
          <div className={styles.summaryTotalBox({ color: "mint" })}>
            <div className={styles.summaryTotalTitle({ color: "mint" })}>
              총 지출액
            </div>
            <div className={styles.summaryTotalAmount({ color: "mint" })}>
              {isSummaryLoading
                ? "-"
                : formatMoney(expenseSummary?.total_amount ?? "0")}
            </div>
          </div>
        </div>

        <div className={styles.summaryContentBox}>
          <div className={styles.summaryContentTitle}>구분별 지출 내역</div>
          {isSummaryLoading ? (
            <div className={styles.summaryContentEmpty}>
              지출 집계를 불러오는 중입니다.
            </div>
          ) : summaryError ? (
            <div className={styles.summaryContentEmpty}>{summaryError}</div>
          ) : summaryItems.length === 0 ? (
            <div className={styles.summaryContentEmpty}>
              집계된 지출 내역이 없습니다.
            </div>
          ) : (
            summaryItems.map((item) => (
              <div
                key={item.category}
                className={styles.summaryContentItemBox}
              >
                <div className={styles.summaryContentItemInfo}>
                  <div className={styles.summaryContentItemTitle}>
                    {item.category || "미분류"}
                  </div>
                  <div className={styles.summaryContentItemDescription}>
                    {item.count}건
                  </div>
                </div>
                <div className={styles.summaryContentItemAmount}>
                  {formatMoney(item.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isReviewMode ? (
        <ReconciliationReview onBack={() => setIsReviewMode(false)} />
      ) : (
        <>
          <div className={styles.fileContainer}>
            {fileData.map((item) => (
              <div key={item.title} className={styles.fileBox}>
                <div className={styles.fileTitleBox}>
                  <div className={styles.fileIconBox({ color: item.color })}>
                    <img
                      className={styles.fileIcon}
                      src={item.icon}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                  <div className={styles.fileTitleDescriptionBox}>
                    <div className={styles.fileTitle}>{item.title}</div>
                    <div className={styles.fileDescription}>
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className={styles.fileListBox}>
                  {item.bulletPoints.map((point) => (
                    <div key={point} className={styles.fileListItem}>
                      • {point}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.checklistBox}>
            <div className={styles.checklistTitle}>생성 전 체크리스트:</div>
            <div className={styles.checklistItemBox}>
              {checklistItems.map((item) => (
                <div key={item} className={styles.checklistItem}>
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.buttonBox}
            onClick={() => setIsReviewMode(true)}
          >
            <img
              className={styles.buttonIcon}
              src={eye}
              alt=""
              aria-hidden="true"
            />
            <div className={styles.buttonText}>검토 후 생성하기</div>
          </button>
        </>
      )}
    </div>
  );
};

export default Create;
