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
import { useEvidenceReview } from "@/contexts/EvidenceReviewContext";
import { useState } from "react";
import NotificationBell from "@/components/common/NotificationBell";

type Role = "TREASURER" | "AUDITOR" | "STUDENT" | "PRESIDENT" | "ADMIN";
const roleOptions = [
  { label: "재정담당자", value: "TREASURER" },
  { label: "감사위원", value: "AUDITOR" },
  { label: "일반 학우", value: "STUDENT" },
  { label: "회장", value: "PRESIDENT" },
  { label: "운영자", value: "ADMIN" },
];

const getRoleFromPath = (pathname: string): Role => {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/president")) return "PRESIDENT";
  if (pathname.startsWith("/auditor")) return "AUDITOR";
  if (pathname.startsWith("/student")) return "STUDENT";
  return "TREASURER";
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearReviewItems } = useEvidenceReview();
  const role = getRoleFromPath(location.pathname);
  const roleLabel = roleOptions.find((option) => option.value === role)?.label;
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(tokenStorage.getAccessToken()));

  const menuByRole = () => {
    switch (role) {
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

  const handleAuthClick = () => {
    if (isLoggedIn) {
      clearReviewItems();
      tokenStorage.removeAccessToken();
      setIsLoggedIn(false);
    }

    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
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
          <div className={styles.roleBadge}>{roleLabel}</div>
        </div>
        <div className={styles.divider}></div>

        <nav className={styles.menuBox}>
          {menuByRole().map((menu) => (
            <NavLink
              key={menu.to}
              to={menu.to}
              end={menu.to === ROUTES.DASHBOARD}
              className={styles.eachmenuBox}
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

        <div className={styles.authBox}>
          <button className={styles.authButton} type="button" onClick={handleAuthClick}>
            {isLoggedIn ? "로그아웃" : "로그인"}
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
