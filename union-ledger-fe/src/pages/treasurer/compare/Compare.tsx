import UploadCard from "@/components/common/UploadCard";
import * as styles from "@/pages/treasurer/compare/Compare.css";

const Compare = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>거래내역 대조</span>
        <span className={styles.desc}>은행 거래내역과 증빙 매칭 </span>
      </div>
      <div className={styles.contentContainer}>
        <span className={styles.uploadTitle}>은행 거래내역 업로드</span>
        <UploadCard
          iconBackground="purple"
          title="엑셀 파일 선택"
          desc=".xlsx, .csv"
          accept=".xls,.csv"
          onChangeFile={(files) => {
            console.log(files);
          }}
        />
      </div>
    </div>
  );
};

export default Compare;
