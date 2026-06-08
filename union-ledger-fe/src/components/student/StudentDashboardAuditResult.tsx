import * as styles from "@components/student/StudentDashboardAuditResult.css";
import check from "@assets/dashboard/check.svg";
import smallCheck from "@assets/dashboard/small-check.svg";
import xIcon from "@assets/dashboard/x-icon.svg";

type SettlementStatus = "APPROVED" | "UNAPPROVED";

export type StudentAuditResultItem = {
  id: string;
  semester: string;
  status: SettlementStatus;
  amount: number;
  comment: string;
  approvedAt: string | null;
};

const StudentDashboardAuditResult = ({
  results = [],
}: {
  results?: StudentAuditResultItem[];
}) => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>
        <img src={check} alt="최근 감사 결과" />
        <span>최근 감사 결과</span>
      </span>
      <div className={styles.contentContainer}>
        {results.length === 0 ? (
          <p className={styles.resultComment}>아직 공개된 감사 결과가 없습니다.</p>
        ) : (
          results.map((item) => (
            <div key={item.id} className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.resultHeaderRight}>
                  <strong className={styles.resultSemester}>
                    {item.semester}
                  </strong>
                  <span className={styles.resultStatus}>
                    <img
                      src={item.status === "APPROVED" ? smallCheck : xIcon}
                      alt={item.status === "APPROVED" ? "승인" : "미승인"}
                    />
                    <span>{item.status === "APPROVED" ? "승인" : "미승인"}</span>
                  </span>
                </div>
                <strong className={styles.resultAmount}>
                  ₩{item.amount.toLocaleString("ko-KR")}
                </strong>
              </div>
              {item.comment && (
                <p className={styles.resultComment}>"{item.comment}"</p>
              )}
              <span className={styles.resultApprovedAt}>
                {item.status === "APPROVED"
                  ? `감사 완료: ${item.approvedAt ?? "-"}`
                  : "감사 미완료"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboardAuditResult;
