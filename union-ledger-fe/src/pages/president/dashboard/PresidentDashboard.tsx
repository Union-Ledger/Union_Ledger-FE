import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/constant/router";
import * as styles from "./PresidentDashboard.css";

const treasurerReports = [
  {
    name: "김재정",
    email: "treasurer1@konkuk.ac.kr",
    status: "제출 완료",
    semester: "2026-1학기",
    progress: 100,
    totalAmount: "₩8,420,000",
    receiptCount: "47건",
    recentActivity: "2시간 전",
    submittedAt: "2026-04-22",
    note: "감사위원 검토 대기 중",
  },
  {
    name: "이재무",
    email: "treasurer2@konkuk.ac.kr",
    status: "진행 중",
    semester: "2025-2학기",
    progress: 75,
    totalAmount: "₩6,200,000",
    receiptCount: "38건",
    recentActivity: "1일 전",
    submittedAt: "-",
    note: "작업 진행중",
  },
];

const auditors = [
  {
    name: "박감사",
    email: "auditor1@konkuk.ac.kr",
    assigned: 3,
    completed: 2,
    pending: 1,
    avgDays: "2.1일",
    recentActivity: "3시간 전",
  },
  {
    name: "최검토",
    email: "auditor2@konkuk.ac.kr",
    assigned: 2,
    completed: 1,
    pending: 1,
    avgDays: "1.8일",
    recentActivity: "5시간 전",
  },
];

const members = [
  { name: "김재정", email: "treasurer1@konkuk.ac.kr", role: "재정담당자" },
  { name: "이재무", email: "treasurer2@konkuk.ac.kr", role: "재정담당자" },
  { name: "박감사", email: "auditor1@konkuk.ac.kr", role: "감사위원" },
  { name: "최검토", email: "auditor2@konkuk.ac.kr", role: "감사위원" },
];

const statCards = [
  { icon: "👥", label: "팀 구성원", value: "5명", color: "blue" },
  { icon: "📄", label: "제출된 결산안", value: "2건", color: "pink" },
  { icon: "✓", label: "감사 완료", value: "1건", color: "green" },
  { icon: "◷", label: "검토 대기", value: "1건", color: "orange" },
] as const;

const PresidentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>회장 대시보드</span>
        <span className={styles.desc}>
          팀원들의 결산 업무 진행 상황을 한눈에 확인하세요
        </span>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((card) => (
          <div key={card.label} className={styles.statCard}>
            <div className={styles.statIcon({ color: card.color })}>
              {card.icon}
            </div>
            <span className={styles.statLabel}>{card.label}</span>
            <strong className={styles.statValue}>{card.value}</strong>
          </div>
        ))}
      </div>

      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>재정담당자 결산안 현황</h2>
        <div className={styles.reportList}>
          {treasurerReports.map((report) => (
            <div key={report.email} className={styles.reportItem}>
              <div className={styles.reportHeader}>
                <div>
                  <span className={styles.memberName}>{report.name}</span>
                  <span className={styles.statusBadge}>{report.status}</span>
                  <p className={styles.memberEmail}>{report.email}</p>
                </div>
                <div className={styles.semesterBox}>
                  <span>학기</span>
                  <strong>{report.semester}</strong>
                </div>
              </div>

              <div className={styles.progressMeta}>
                <span>{report.note}</span>
                <span>{report.progress}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${report.progress}%` }}
                />
              </div>

              <div className={styles.reportStats}>
                <div>
                  <span className={styles.reportStatLabel}>총 지출액</span>
                  <strong className={styles.reportStatValue}>
                    {report.totalAmount}
                  </strong>
                </div>
                <div>
                  <span className={styles.reportStatLabel}>증빙 건수</span>
                  <strong className={styles.reportStatValue}>
                    {report.receiptCount}
                  </strong>
                </div>
                <div>
                  <span className={styles.reportStatLabel}>최근 활동</span>
                  <strong className={styles.reportStatValue}>
                    {report.recentActivity}
                  </strong>
                </div>
              </div>

              <p className={styles.reportFooter}>
                제출일: {report.submittedAt} | {report.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>감사위원 활동 현황</h2>
        <div className={styles.auditList}>
          {auditors.map((auditor) => (
            <div key={auditor.email} className={styles.auditItem}>
              <div className={styles.auditHeader}>
                <div>
                  <span className={styles.memberName}>{auditor.name}</span>
                  <p className={styles.memberEmail}>{auditor.email}</p>
                </div>
                <span>최근 활동: {auditor.recentActivity}</span>
              </div>
              <div className={styles.auditStats}>
                <div className={styles.auditStatItem}>
                  <span className={styles.auditStatLabel}>배정된 결산안</span>
                  <strong className={styles.auditStatValue}>
                    {auditor.assigned}
                  </strong>
                </div>
                <div className={styles.auditStatItem}>
                  <span className={styles.auditStatLabel}>검토 완료</span>
                  <strong
                    className={`${styles.auditStatValue} ${styles.successText}`}
                  >
                    {auditor.completed}
                  </strong>
                </div>
                <div className={styles.auditStatItem}>
                  <span className={styles.auditStatLabel}>검토 대기</span>
                  <strong
                    className={`${styles.auditStatValue} ${styles.warningText}`}
                  >
                    {auditor.pending}
                  </strong>
                </div>
                <div className={styles.auditStatItem}>
                  <span className={styles.auditStatLabel}>평균 검토 시간</span>
                  <strong
                    className={`${styles.auditStatValue} ${styles.primaryText}`}
                  >
                    {auditor.avgDays}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.bottomGrid}>
        <section className={styles.panel}>
          <div className={styles.teamHeader}>
            <h2 className={styles.sectionTitle}>팀 구성원</h2>
            <button
              type="button"
              className={styles.inviteButton}
              onClick={() => navigate(ROUTES.PRESIDENT_INVITE)}
            >
              ✉ 팀원 초대
            </button>
          </div>
          <div className={styles.memberList}>
            {members.map((member) => (
              <div key={member.email} className={styles.memberItem}>
                <div>
                  <span className={styles.memberName}>{member.name}</span>
                  <p className={styles.memberEmail}>{member.email}</p>
                </div>
                <span className={styles.roleBadge}>{member.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>조직 정보</h2>
          <div className={styles.orgInfoList}>
            <div className={styles.orgInfoItem}>
              <span className={styles.orgInfoLabel}>단과대학</span>
              <strong className={styles.orgInfoValue}>공과대학</strong>
            </div>
            <div className={styles.orgInfoItem}>
              <span className={styles.orgInfoLabel}>학과</span>
              <strong className={styles.orgInfoValue}>컴퓨터공학과</strong>
            </div>
            <div className={styles.orgInfoItem}>
              <span className={styles.orgInfoLabel}>회장</span>
              <strong className={styles.orgInfoValue}>홍길동</strong>
            </div>
            <div className={styles.orgInfoItem}>
              <span className={styles.orgInfoLabel}>학기</span>
              <strong className={styles.orgInfoValue}>2026-1학기</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PresidentDashboard;
