import UploadCard from "@/components/common/UploadCard";
import * as styles from "@/pages/template/Template.css";

const Template = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>결산안 양식 등록</span>
        <span className={styles.desc}>
          학교/학과별 결산안 엑셀 양식 업로드 (최초 1회)
        </span>
      </div>
      <div className={styles.contentContainer}>
        <span className={styles.uploadTitle}>엑셀 양식 파일</span>
        <UploadCard
          iconBackground="green"
          title="파일 선택"
          desc=".xlsx, .xls"
          accept=".xls,.xlsx"
          onChangeFile={(files) => {
            console.log(files);
          }}
        />
        <div className={styles.uploadInfoContainer}>
          <span className={styles.uploadInfoTitle}>자동 인식 항목:</span>
          <ul className={styles.uploadInfoDescContainer}>
            <li className={styles.uploadInfoDesc}>
              날짜, 적요, 입금, 출금, 잔액, 비고
            </li>
            <li className={styles.uploadInfoDesc}>
              한 번 등록하면 재사용 가능
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Template;
