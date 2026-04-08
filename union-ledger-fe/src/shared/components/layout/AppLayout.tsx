import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "@router/constant/router";
import * as styles from "./AppLayout.css";
import { layoutMenus } from "./layoutMenu";
import title from "@assets/sidebar-title.svg";

const AppLayout = () => {
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
            <div className={styles.dropdown}></div>
        </div>
        <div className={styles.divider}></div>

        <nav className={styles.menuBox}>
        {layoutMenus.map((menu) => (
          <NavLink key={menu.to} to={menu.to} end={menu.to === ROUTES.DASHBOARD} className={styles.eachmenuBox}>
            {({ isActive }) => (
              <div className={styles.menuItem({ active: isActive })}>
                <img className={styles.menuIcon} src={menu.icon} alt="" aria-hidden="true" />
                <div className={styles.menuLabel}>{menu.label}</div>
              </div>
            )}
          </NavLink>
        ))}
        </nav>
        <div className={styles.divider}></div>

        <div className={styles.footer}>
            © 2026 Union-Ledger
        </div>
      </div>

      <main className={styles.content}>

          <Outlet />

      </main>
    </div>
  );
};

export default AppLayout;
