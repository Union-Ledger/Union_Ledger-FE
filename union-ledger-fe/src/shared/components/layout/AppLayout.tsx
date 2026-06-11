import { useEffect, useState } from "react";
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
          <div className={styles.roleBadge}>{SECTION_LABELS[section]}</div>
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
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
