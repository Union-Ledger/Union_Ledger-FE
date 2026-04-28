import * as styles from "./Create.css";
import { expenseItems } from "./createData.ts";
import { fileData } from "./fileData.ts";
import { checklistItems } from "./checklist.ts";
import eye from "@assets/eye.svg";


const Create = () => {


  return (
    <div className={styles.container}>
      <div className={styles.titleBox}>
        <div className={styles.title}>결산안 생성</div>
        <div className={styles.description}>모든 증빙과 거래내역 대조가 완료되면 최종 결산안을 생성하세요</div>
      </div>

      <div className={styles.summaryBox}>
        <div className={styles.summaryTitleBox}>
          <div className={styles.summaryTitle}>결산안 요약</div>
          <div className={styles.summaryDescription}>2024학년도 2학기 (2024.09.01 - 2025.02.28)</div>
        </div>

        <div className={styles.summaryTotalContainer}>
            <div className={styles.summaryTotalBox({ color: "blueSoft" })}>
              <div className={styles.summaryTotalTitle({ color: "blueSoft" })}>총 증빙 건수</div>
              <div className={styles.summaryTotalAmount({ color: "blueSoft" })}>47건</div>
            </div>
            <div className={styles.summaryTotalBox({ color: "mint" })}>
              <div className={styles.summaryTotalTitle({ color: "mint" })}>총 지출액</div>
              <div className={styles.summaryTotalAmount({ color: "mint" })}>$8,420,000</div>
            </div>

        </div>

        <div className={styles.summaryContentBox}>
          <div className={styles.summaryContentTitle}>항목별 지출 내역</div>
          {expenseItems.map((item) => (
            <div key={item.category} className={styles.summaryContentItemBox}> 
              <div className={styles.summaryContentItemInfo}>
                <div className={styles.summaryContentItemTitle}>{item.category}</div>
                <div className={styles.summaryContentItemDescription}>{item.count}</div>
              </div>
              <div className={styles.summaryContentItemAmount}>{item.amount}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.fileContainer}>
        {fileData.map((item) => (
          <div key={item.title} className={styles.fileBox}>
            <div className={styles.fileTitleBox}>
              <div className={styles.fileIconBox({ color: item.color })}>
                 <img className={styles.fileIcon} src={item.icon} alt="" aria-hidden="true" />
              </div>
              <div className={styles.fileTitleDescriptionBox}>
                <div className={styles.fileTitle}>{item.title}</div>
                <div className={styles.fileDescription}>{item.description}</div>
              </div>
            </div>
            <div className={styles.fileListBox}>
              {item.bulletPoints.map((point) => (
                <div key={point} className={styles.fileListItem}>
                  • {point}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.checklistBox}>
        <div className={styles.checklistTitle}>생성 전 체크리스트:</div>
        <div className={styles.checklistItemBox}>
          {checklistItems.map((item) => (
          <div key={item} className={styles.checklistItem}>
            ✓ {item}
          </div>
        ))}
        </div>
      </div>

      <div className={styles.buttonBox}>
        <img className={styles.buttonIcon} src={eye} alt="" aria-hidden="true" />
        <div className={styles.buttonText}>검토 후 생성하기</div>
      </div>
    </div>
  );
};

export default Create;
