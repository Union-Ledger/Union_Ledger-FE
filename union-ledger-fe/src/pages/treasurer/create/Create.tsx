import { useEffect, useState } from "react";
import * as styles from "./Create.css";
import { fileData } from "./fileData.ts";
import { checklistItems } from "./checklist.ts";
import eye from "@assets/eye.svg";
import ReconciliationReview from "@pages/treasurer/create/ReconciliationReview";
import useSettlementApi, {
  type ExpenseSummaryResponse,
} from "@/hooks/useSettlementApi";

const formatMoney = (amount: string) => {
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount)) {
    return "₩0";
  }

  return `₩${Math.round(parsedAmount).toLocaleString("ko-KR")}`;
};

const Create = () => {
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [expenseSummary, setExpenseSummary] =
    useState<ExpenseSummaryResponse | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  const { getExpenseSummary } = useSettlementApi();
  const [getExpenseSummaryOnce] = useState(() => getExpenseSummary);

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

  const summaryItems = expenseSummary?.by_category ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.titleBox}>
        <div className={styles.title}>결산안 생성</div>
        <div className={styles.description}>
          모든 증빙과 거래내역 대조가 완료되면 최종 결산안을 생성하세요
        </div>
      </div>

      <div className={styles.summaryBox}>
        <div className={styles.summaryTitleBox}>
          <div className={styles.summaryTitle}>결산안 요약</div>
          <div className={styles.summaryDescription}>
            2024학년도 2학기 (2024.09.01 - 2025.02.28)
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
          <div className={styles.summaryContentTitle}>항목별 지출 내역</div>
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
