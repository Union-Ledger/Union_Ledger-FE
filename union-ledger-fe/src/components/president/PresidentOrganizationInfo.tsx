import type { PresidentDashboardOrganization } from "@/hooks/useDashboardApi";
import * as styles from "./PresidentDashboardSections.css";

interface PresidentOrganizationInfoProps {
  organization: PresidentDashboardOrganization;
}

const PresidentOrganizationInfo = ({
  organization,
}: PresidentOrganizationInfoProps) => {
  const items = [
    { label: "단과대학", value: organization.college_name },
    { label: "학과", value: organization.department_name },
    { label: "회장", value: organization.president_name },
    { label: "학기", value: organization.current_period_label },
  ];

  return (
    <section className={styles.panel}>
      <h2 className={styles.compactSectionTitle}>조직 정보</h2>
      <div className={styles.orgInfoList}>
        {items.map((item) => (
          <div key={item.label} className={styles.orgInfoItem}>
            <span className={styles.orgInfoLabel}>{item.label}</span>
            <strong className={styles.orgInfoValue}>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PresidentOrganizationInfo;
