import Spinner from "@shared/components/feedback/Spinner";
import * as styles from "./SplashScreen.css";

const SplashScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo} aria-hidden="true">
        UL
      </div>
      <p className={styles.name}>Union-Ledger</p>
      <Spinner size="md" label="화면을 불러오는 중" />
    </div>
  );
};

export default SplashScreen;
