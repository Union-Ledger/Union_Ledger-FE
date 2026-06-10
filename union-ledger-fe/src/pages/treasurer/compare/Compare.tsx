import { useCallback, useEffect, useState } from "react";
import UploadCard from "@/components/common/UploadCard";
import useSettlementApi, {
  type BankStatementUploadResponse,
} from "@/hooks/useSettlementApi";
import { useToast } from "@shared/components/feedback";
import * as styles from "@/pages/treasurer/compare/Compare.css";

const BANK_STATEMENT_EXTENSIONS = [".xlsm", ".xlsx"];

const isValidBankStatementFile = (file: File) => {
  const lowerFileName = file.name.toLowerCase();

  return BANK_STATEMENT_EXTENSIONS.some((extension) =>
    lowerFileName.endsWith(extension),
  );
};

const Compare = () => {
  const { postBankStatement, getBankStatements, deleteBankStatement } =
    useSettlementApi();
  const toast = useToast();
  const [currentSettlementId] = useState(() =>
    localStorage.getItem("currentSettlementId"),
  );
  const [getBankStatementsOnce] = useState(() => getBankStatements);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingStatements, setIsLoadingStatements] = useState(
    Boolean(currentSettlementId),
  );
  const [listErrorMessage, setListErrorMessage] = useState("");
  const [deletingUploadIds, setDeletingUploadIds] = useState(
    () => new Set<string>(),
  );
  const [uploadedStatements, setUploadedStatements] = useState<
    BankStatementUploadResponse[]
  >([]);

  const refreshUploadedStatements = useCallback(async () => {
    if (!currentSettlementId) {
      setUploadedStatements([]);
      setIsLoadingStatements(false);
      return;
    }

    try {
      setListErrorMessage("");
      const statements = await getBankStatementsOnce(currentSettlementId);
      setUploadedStatements(statements);
    } catch (error) {
      console.error("거래내역 목록 조회 실패", error);
      setListErrorMessage("업로드한 거래내역서를 불러오지 못했습니다.");
    } finally {
      setIsLoadingStatements(false);
    }
  }, [currentSettlementId, getBankStatementsOnce]);

  useEffect(() => {
    void refreshUploadedStatements();
  }, [refreshUploadedStatements]);

  const handleChangeFile = async (files: FileList | null) => {
    const file = files?.[0];

    if (!file) return;

    if (!isValidBankStatementFile(file)) {
      toast.error("거래내역 파일은 .xlsm, .xlsx 형식만 업로드할 수 있습니다.");
      return;
    }

    const settlementId = localStorage.getItem("currentSettlementId");

    if (!settlementId) {
      toast.error("결산안 정보가 없습니다. 먼저 증빙 업로드 단계를 진행해주세요.");
      return;
    }

    try {
      setIsUploading(true);

      await postBankStatement({
        settlementId,
        file,
      });

      await refreshUploadedStatements();
      toast.success("거래내역 업로드가 완료되었습니다.");
    } catch (error) {
      console.error("거래내역 업로드 실패", error);
      toast.error("거래내역 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteStatement = async (item: BankStatementUploadResponse) => {
    if (deletingUploadIds.has(item.id)) return;

    setDeletingUploadIds((prevIds) => {
      const nextIds = new Set(prevIds);
      nextIds.add(item.id);
      return nextIds;
    });

    try {
      await deleteBankStatement(item.id);
      setUploadedStatements((prevItems) =>
        prevItems.filter((statement) => statement.id !== item.id),
      );
      toast.success("거래내역서가 삭제되었습니다.");
    } catch (error) {
      console.error("거래내역 삭제 실패", error);
      toast.error("거래내역 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setDeletingUploadIds((prevIds) => {
        const nextIds = new Set(prevIds);
        nextIds.delete(item.id);
        return nextIds;
      });
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

      <section className={styles.uploadListSection}>
        <div className={styles.uploadListHeader}>
          <h2 className={styles.uploadListTitle}>업로드한 거래내역서</h2>
          <span className={styles.uploadCount}>
            {uploadedStatements.length}개
          </span>
        </div>

        {isLoadingStatements ? (
          <div className={styles.emptyList}>거래내역서를 불러오는 중입니다.</div>
        ) : listErrorMessage ? (
          <div className={styles.emptyList}>{listErrorMessage}</div>
        ) : uploadedStatements.length === 0 ? (
          <div className={styles.emptyList}>
            아직 업로드한 거래내역서가 없습니다.
          </div>
        ) : (
          <div className={styles.uploadList}>
            {uploadedStatements.map((item) => (
              <article key={item.id} className={styles.uploadItem}>
                <div className={styles.fileIcon} aria-hidden="true">
                  XLS
                </div>
                <div className={styles.fileInfo}>
                  <strong className={styles.fileName}>
                    {item.source_file_name}
                  </strong>
                  <span className={styles.uploadedAt}>
                    {new Date(item.created_at).toLocaleString("ko-KR")}
                    {` · ${item.parsed_rows_count.toLocaleString("ko-KR")}행`}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.deleteButton}
                  disabled={deletingUploadIds.has(item.id)}
                  aria-label={`${item.source_file_name} 삭제`}
                  onClick={() => void handleDeleteStatement(item)}
                >
                  ×
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Compare;
