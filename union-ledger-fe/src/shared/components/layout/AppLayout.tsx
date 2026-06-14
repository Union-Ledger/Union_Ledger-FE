import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import * as styles from "./AppLayout.css";
import {
  adminLayoutMenus,
  auditorLayoutMenus,
  presidentLayoutMenus,
  studentLayoutMenus,
  treasurerLayoutMenus,
} from "./layoutMenu";
import title from "@assets/sidebar-title.svg";
import { tokenStorage } from "@/utils/token";
import { useAuth } from "@/contexts/AuthContext";
import { useEvidenceReview } from "@/contexts/EvidenceReviewContext";
import NotificationBell from "@/components/common/NotificationBell";
import SessionTimer from "@/components/common/SessionTimer";
import TreasurerStepper from "@/components/treasurer/TreasurerStepper";

// 재정 파이프라인 단계 페이지 — 스텝퍼 노출 대상
const PIPELINE_ROUTES: string[] = [
  ROUTES.TEMPLATE,
  ROUTES.UPLOAD,
  ROUTES.COMPARE,
  ROUTES.CREATE,
];

type Role = "TREASURER" | "AUDITOR" | "STUDENT" | "PRESIDENT" | "ADMIN";

const SECTION_LABELS: Record<Role, string> = {
  TREASURER: "재정담당자",
  AUDITOR: "감사위원",
  STUDENT: "일반 학우",
  PRESIDENT: "회장",
  ADMIN: "운영자",
};

const ROLE_LABELS: Record<string, string> = {
  president: "회장",
  treasurer: "재정담당자",
  auditor: "감사위원",
  student: "일반 학우",
};

// 현재 보고 있는 메뉴 영역(섹션)은 URL 기준 — 사용자 실제 권한과는 별개다.
const getSectionFromPath = (pathname: string): Role => {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/president")) return "PRESIDENT";
  if (pathname.startsWith("/auditor")) return "AUDITOR";
  if (pathname.startsWith("/student")) return "STUDENT";
  return "TREASURER";
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { me } = useAuth();
  const { clearReviewItems } = useEvidenceReview();
  const section = getSectionFromPath(location.pathname);
  // 모바일(≤768px) 드로어 — 데스크톱에서는 항상 펼쳐진 사이드바
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  const myRoleLabels = me
    ? [
        ...(me.is_operator ? ["운영자"] : []),
        ...(me.roles ?? []).map((role) => ROLE_LABELS[role] ?? role),
      ]
    : [];

  // 권한상 접근 가능한 작업 영역 — 2개 이상이면 전환 드롭다운 노출
  const accessibleSections = useMemo(() => {
    const roles = me?.roles ?? [];
    const sections: { value: Role; label: string; to: string }[] = [];

    if (roles.includes("president")) {
      sections.push({
        value: "PRESIDENT",
        label: SECTION_LABELS.PRESIDENT,
        to: ROUTES.PRESIDENT_DASHBOARD,
      });
    }
    if (roles.includes("treasurer") || roles.includes("president")) {
      sections.push({
        value: "TREASURER",
        label: SECTION_LABELS.TREASURER,
        to: ROUTES.TREASURER_DASHBOARD,
      });
    }
    if (roles.includes("auditor")) {
      sections.push({
        value: "AUDITOR",
        label: SECTION_LABELS.AUDITOR,
        to: ROUTES.AUDITOR_DASHBOARD,
      });
    }
    // 학생 영역은 모든 사용자가 접근 가능
    sections.push({
      value: "STUDENT",
      label: SECTION_LABELS.STUDENT,
      to: ROUTES.STUDENT_DASHBOARD,
    });
    if (me?.is_operator) {
      sections.push({
        value: "ADMIN",
        label: SECTION_LABELS.ADMIN,
        to: ROUTES.ADMIN_APPLICATIONS,
      });
    }

    return sections;
  }, [me]);

  const handleSectionChange = (value: string) => {
    const next = accessibleSections.find((item) => item.value === value);
    if (!next) return;
    setIsSidebarOpen(false);
    navigate(next.to);
  };

  const menuByRole = () => {
    switch (section) {
      case "TREASURER":
        return treasurerLayoutMenus;
      case "AUDITOR":
        return auditorLayoutMenus;
      case "STUDENT":
        return studentLayoutMenus;
      case "PRESIDENT":
        return presidentLayoutMenus;
      case "ADMIN":
        return adminLayoutMenus;
      default:
        return [];
    }
  };

  const handleLogout = () => {
    clearReviewItems();
    tokenStorage.removeAccessToken();
    tokenStorage.removeRefreshToken();
    localStorage.removeItem("organizationId");
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.mobileMenuButton}
        aria-label={isSidebarOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        ☰
      </button>
      {isSidebarOpen && (
        <div
          className={styles.mobileOverlay}
          role="presentation"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.titleBox}>
          <div className={styles.titleIconBox}>
            <img className={styles.titleIcon} src={title} alt="Union-Ledger" />
          </div>
          <div className={styles.titleTextGroup}>
            <div className={styles.titleMain}>Union-Ledger</div>
            <span className={styles.titleSub}>결산 시스템</span>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.dropdownBox}>
          {accessibleSections.length > 1 ? (
            <select
              className={styles.dropdown}
              value={section}
              aria-label="작업 영역 전환"
              onChange={(event) => handleSectionChange(event.target.value)}
            >
              {accessibleSections.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
              {!accessibleSections.some((item) => item.value === section) && (
                <option value={section} disabled>
                  {SECTION_LABELS[section]}
                </option>
              )}
            </select>
          ) : (
            <div className={styles.roleBadge}>{SECTION_LABELS[section]}</div>
          )}
        </div>
        <div className={styles.divider}></div>

        <nav className={styles.menuBox}>
          {menuByRole().map((menu) => (
            <NavLink
              key={menu.to}
              to={menu.to}
              end={menu.to === ROUTES.DASHBOARD}
              className={styles.eachmenuBox}
              onClick={() => setIsSidebarOpen(false)}
            >
              {({ isActive }) => (
                <div className={styles.menuItem({ active: isActive })}>
                  <img
                    className={styles.menuIcon}
                    src={menu.icon}
                    alt=""
                    aria-hidden="true"
                  />
                  <div className={styles.menuLabel}>{menu.label}</div>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <div className={styles.divider}></div>

        {me && <SessionTimer />}
        <NotificationBell />
        <div className={styles.divider}></div>

        {me && (
          <>
            <div className={styles.profileBox}>
              <div className={styles.profileAvatar} aria-hidden="true">
                {me.name?.charAt(0) || "?"}
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>{me.name}</span>
                <span className={styles.profileEmail}>{me.email}</span>
                {myRoleLabels.length > 0 && (
                  <div className={styles.profileRoles}>
                    {myRoleLabels.map((label) => (
                      <span key={label} className={styles.profileRoleChip}>
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.divider}></div>
          </>
        )}

        <div className={styles.authBox}>
          <button className={styles.authButton} type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
        <div className={styles.divider}></div>

        <div className={styles.footer}>© 2026 Union-Ledger</div>
      </div>

      <main className={styles.content}>
        {PIPELINE_ROUTES.some((route) =>
          location.pathname.startsWith(route),
        ) && <TreasurerStepper />}
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
