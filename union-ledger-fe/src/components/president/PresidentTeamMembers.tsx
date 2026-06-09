import type { PresidentDashboardMember } from "@/hooks/useDashboardApi";
import * as styles from "./PresidentDashboardSections.css";

interface PresidentTeamMembersProps {
  members: PresidentDashboardMember[];
  onInvite: () => void;
}

const roleLabelMap: Record<string, string> = {
  student: "일반 학우",
  treasurer: "재정담당자",
  auditor: "감사위원",
  president: "회장",
  admin: "운영자",
};

const PresidentTeamMembers = ({
  members,
  onInvite,
}: PresidentTeamMembersProps) => {
  return (
    <section className={styles.panel}>
      <div className={styles.teamHeader}>
        <h2 className={styles.compactSectionTitle}>팀 구성원</h2>
        <button
          type="button"
          className={styles.inviteButton}
          onClick={onInvite}
        >
          팀원 초대
        </button>
      </div>

      {members.length === 0 ? (
        <div className={styles.compactEmptyState}>등록된 팀원이 없습니다.</div>
      ) : (
        <div className={styles.memberList}>
          {members.map((member) => (
            <div key={member.user_id} className={styles.memberItem}>
              <div>
                <strong className={styles.compactMemberName}>
                  {member.name}
                </strong>
                <p className={styles.compactMemberEmail}>{member.email}</p>
              </div>
              <span className={styles.roleBadge}>
                {member.is_primary
                  ? "대표"
                  : roleLabelMap[member.role] || member.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PresidentTeamMembers;
