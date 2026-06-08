import { useState } from "react";
import UploadCard from "@/components/common/UploadCard";
import useSettlementApi from "@/hooks/useSettlementApi";
import * as styles from "@/pages/treasurer/compare/Compare.css";

const BANK_STATEMENT_EXTENSIONS = [".xlsm", ".xlsx"];

const isValidBankStatementFile = (file: File) => {
  const lowerFileName = file.name.toLowerCase();

  return BANK_STATEMENT_EXTENSIONS.some((extension) =>
    lowerFileName.endsWith(extension),
  );
};

const Compare = () => {
  const { postBankStatement } = useSettlementApi();
  const [isUploading, setIsUploading] = useState(false);

  const handleChangeFile = async (files: FileList | null) => {
    const file = files?.[0];

    if (!file) return;

    if (!isValidBankStatementFile(file)) {
      alert("거래내역 파일은 .xlsm, .xlsx 형식만 업로드할 수 있습니다.");
      return;
    }

    const settlementId = localStorage.getItem("currentSettlementId");

    if (!settlementId) {
      alert("결산안 정보가 없습니다. 먼저 증빙 업로드 단계를 진행해주세요.");
      return;
    }

    try {
      setIsUploading(true);

      const result = await postBankStatement({
        settlementId,
        file,
      });

      console.log("거래내역 업로드 성공", result);
      alert("거래내역 업로드가 완료되었습니다.");
    } catch (error) {
      console.error("거래내역 업로드 실패", error);
      alert("거래내역 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>거래내역 대조</span>
        <span className={styles.desc}>은행 거래내역과 증빙 매칭</span>
      </div>

      <div className={styles.contentContainer}>
        <span className={styles.uploadTitle}>은행 거래내역 업로드</span>

        <UploadCard
          iconBackground="purple"
          title={isUploading ? "업로드 중..." : "엑셀 파일 선택"}
          desc=".xlsm, .xlsx"
          accept=".xlsm,.xlsx"
          disabled={isUploading}
          onChangeFile={handleChangeFile}
        />
      </div>
    </div>
  );
};

export default Compare;
