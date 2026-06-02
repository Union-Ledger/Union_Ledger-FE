import { useEffect, useState } from "react";
import UploadCard from "@/components/common/UploadCard";
import useOrganizationApi from "@/hooks/useOrginizationApi";
import useSettlementApi from "@/hooks/useSettlementApi";
import useCommonApi from "@/hooks/useCommonApi";
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

const evidenceTypeMap: Record<ReceiptType, string> = {
  offlineReceipt: "physical_receipt",
  statement: "bank_statement",
  onlineReceipt: "electronic_receipt",
};

const Upload = () => {
  const [selectedType, setSelectedType] =
    useState<ReceiptType>("offlineReceipt");
  const [settlementId, setSettlementId] = useState<string | null>(null);
  const [budgetCategory, setBudgetCategory] = useState("");
  const [isPreparing, setIsPreparing] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const { getOrganization, getTemplate, postSettlement } = useOrganizationApi();
  const { postEvidence } = useSettlementApi();
  const { postEvidenceExtract, patchEvidenceBudgetCategory } = useCommonApi();

  useEffect(() => {
    const prepareSettlement = async () => {
      try {
        const savedSettlementId = localStorage.getItem("currentSettlementId");

        if (savedSettlementId) {
          setSettlementId(savedSettlementId);
          return;
        }

        let organizationId = localStorage.getItem("organizationId");

        if (!organizationId) {
          const organizations = await getOrganization();

          if (!organizations || organizations.length === 0) {
            alert("소속된 조직이 없습니다.");
            return;
          }

          organizationId = organizations[0].id;
          localStorage.setItem("organizationId", organizationId);
        }

        const templates = await getTemplate(organizationId);

        if (!templates || templates.length === 0) {
          alert("등록된 결산안 템플릿이 없습니다. 먼저 템플릿을 등록해주세요.");
          return;
        }

        const activeTemplate = templates.find(
          (template: { is_active: boolean }) => template.is_active,
        );

        const templateId = activeTemplate?.id ?? templates[0].id;

        const settlement = await postSettlement({
          organizationId,
          templateId,
          title: "2024년도 2학기 결산안",
          academicYear: 2024,
          semester: "2",
        });

        if (settlement?.id) {
          localStorage.setItem("currentSettlementId", settlement.id);
          setSettlementId(settlement.id);
        }
      } catch (error) {
        console.error("결산안 생성 준비 실패", error);
      } finally {
        setIsPreparing(false);
      }
    };

    prepareSettlement();
  }, []);

  const handleChangeFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!settlementId) {
      alert("결산안 생성이 완료된 후 다시 업로드해주세요.");
      return;
    }

    const trimmedBudgetCategory = budgetCategory.trim();

    if (!trimmedBudgetCategory) {
      alert("카테고리를 입력한 후 업로드해주세요.");
      return;
    }

    const fileList = Array.from(files);

    // 임시 프론트 제한: 10MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const oversizedFile = fileList.find((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFile) {
      alert(
        `${oversizedFile.name} 파일이 너무 큽니다. 10MB 이하 파일로 업로드해주세요.`,
      );
      return;
    }

    try {
      setIsUploading(true);

      const uploadResults = await Promise.all(
        fileList.map((file) =>
          postEvidence({
            settlementId,
            evidenceType: evidenceTypeMap[selectedType],
            budgetCategory: trimmedBudgetCategory,
            file,
          }),
        ),
      );

      console.log("증빙 업로드 성공", uploadResults);

      const uploadedEvidences = uploadResults.filter(
        (result) => result && result.id,
      );

      if (uploadedEvidences.length === 0) {
        alert("업로드된 증빙이 없습니다.");
        return;
      }

      const extractResults = await Promise.allSettled(
        uploadedEvidences.map((evidence) => postEvidenceExtract(evidence.id)),
      );

      const failedExtracts = extractResults.filter(
        (result) => result.status === "rejected",
      );

      if (failedExtracts.length > 0) {
        console.error("OCR/PDF 추출 실패 목록", failedExtracts);
        alert("증빙 업로드는 완료됐지만, OCR/PDF 추출에 실패했습니다.");
        return;
      }

      await Promise.all(
        uploadedEvidences.map((evidence) =>
          patchEvidenceBudgetCategory(evidence.id, trimmedBudgetCategory),
        ),
      );

      console.log("OCR/PDF 추출 요청 완료");
    } catch (error) {
      console.error("증빙 업로드 실패", error);
      alert("증빙 업로드에 실패했습니다. 파일 용량을 확인해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

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
                disabled={isPreparing || isUploading}
              >
                <span className={styles.typeCardTitle}>{item.title}</span>
                <span className={styles.typeCardDesc}>{item.desc}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.categoryFieldContainer}>
          <label className={styles.categoryLabel} htmlFor="budget-category">
            카테고리
          </label>
          <input
            id="budget-category"
            className={styles.categoryInput}
            value={budgetCategory}
            placeholder="예: 행사비, 사무용품비"
            disabled={isPreparing || isUploading}
            onChange={(e) => setBudgetCategory(e.target.value)}
          />
        </div>

        <div className={styles.cardContainer}>
          <UploadCard
            iconBackground="purple"
            title={
              isPreparing
                ? "결산안 준비 중..."
                : isUploading
                  ? "업로드 중..."
                  : "파일 선택 (여러 개 가능)"
            }
            desc="JPG, PNG, PDF"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            disabled={isPreparing || isUploading}
            onChangeFile={handleChangeFile}
          />
        </div>
      </div>
    </div>
  );
};

export default Upload;
