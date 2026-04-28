import { useState } from "react";
import UploadCard from "@/components/common/UploadCard";
import * as styles from "@/pages/treasurer/upload/Upload.css";

type ReceiptType = "offlineReceipt" | "statement" | "onlineReceipt";

const receiptTypeOptions: {
  id: ReceiptType;
  title: string;
  desc: string;
}[] = [
  {
    id: "offlineReceipt",
    title: "실물 영수증",
    desc: "카드결제, POS 영수증",
  },
  {
    id: "statement",
    title: "거래명세서",
    desc: "계좌이체 은행문서",
  },
  {
    id: "onlineReceipt",
    title: "전자영수증",
    desc: "온라인 결제",
  },
];

const Upload = () => {
  const [selectedType, setSelectedType] =
    useState<ReceiptType>("offlineReceipt");

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>증빙 업로드</span>
        <span className={styles.desc}>증빙 유형 선택 후 파일 업로드</span>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.typeSelectorContainer}>
          {receiptTypeOptions.map((item) => {
            const isSelected = selectedType === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.typeCard} ${
                  isSelected ? styles.typeCardSelected : styles.typeCardDefault
                }`}
                onClick={() => setSelectedType(item.id)}
              >
                <span className={styles.typeCardTitle}>{item.title}</span>
                <span className={styles.typeCardDesc}>{item.desc}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.cardContainer}>
          <UploadCard
            iconBackground="purple"
            title="파일 선택 (여러 개 가능)"
            desc="JPG, PNG, PDF"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChangeFile={(files) => {
              console.log(selectedType, files);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Upload;
